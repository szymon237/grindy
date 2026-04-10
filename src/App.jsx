import { useReducer, useCallback, useRef, useEffect, useState, useMemo } from 'react';
import {
  Coffee, Search, Plus, ChevronLeft, Star, X, Check,
  MapPin, Mountain, Layers, Droplets, ArrowRight,
  Flame, Filter, CoffeeIcon, SlidersHorizontal, Pen,
  Undo2, AlertCircle, Sparkles, ChevronDown, ChevronUp,
  Timer, Weight, GlassWater, CircleDot,
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
} from 'recharts';
import {
  COFFEE_DATABASE, FLAVOR_NOTES, INITIAL_VISIBLE_TAGS,
  DRINK_TYPES, GRINDER, ROAST_LEVELS, PROCESSING_METHODS,
  COUNTRY_FLAGS, getRoasteriesGrouped,
} from './data/coffeeDatabase';

// ──────────────────────────────────────────────
// localStorage Persistence
// ──────────────────────────────────────────────

const STORAGE_KEY = 'grindy-data';

function loadPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function persistState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      collection: state.collection,
      firstUse: state.firstUse,
    }));
  } catch {
    // Storage full or unavailable — app still works, just no persistence
  }
}

// ──────────────────────────────────────────────
// State Reducer
// ──────────────────────────────────────────────

const persisted = loadPersistedState();

const initialState = {
  // Navigation
  activeTab: 'collection', // collection | discover | add
  currentView: 'list',     // list | detail | addManual
  selectedBeanId: null,
  previousTab: null,

  // User's collection (restored from localStorage)
  collection: persisted?.collection ?? [],

  // Toast notifications
  toast: null,
  toastTimeout: null,

  // First use flag
  firstUse: persisted?.firstUse ?? true,

  // Search
  searchQuery: '',

  // Add flow
  addStep: 0,
  addDraft: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'NAVIGATE_TAB':
      return {
        ...state,
        activeTab: action.tab,
        currentView: 'list',
        selectedBeanId: null,
        searchQuery: '',
        addStep: 0,
        addDraft: null,
      };

    case 'VIEW_BEAN_DETAIL':
      return {
        ...state,
        currentView: 'detail',
        selectedBeanId: action.beanId,
        previousTab: state.activeTab,
      };

    case 'BACK_TO_LIST':
      return {
        ...state,
        currentView: 'list',
        selectedBeanId: null,
      };

    case 'ADD_TO_COLLECTION': {
      const bean = COFFEE_DATABASE.find(b => b.id === action.beanId);
      if (!bean || state.collection.some(c => c.beanId === action.beanId)) return state;
      // Recipes: per drink type, store grind/dose/yield/time (null = not yet dialed in)
      const emptyRecipes = {};
      DRINK_TYPES.forEach(dt => {
        emptyRecipes[dt.id] = { grind: null, dose: null, yield: null, time: null };
      });
      const collectionItem = {
        id: Date.now(),
        beanId: bean.id,
        bean: { ...bean },
        addedAt: new Date().toISOString(),
        rating: null,
        flavorNotes: [],
        tasteProfile: { acidity: 0, sweetness: 0, body: 0, bitterness: 0, aftertaste: 0 },
        recipes: emptyRecipes,
        notes: '',
      };
      return {
        ...state,
        collection: [collectionItem, ...state.collection],
        firstUse: false,
      };
    }

    case 'REMOVE_FROM_COLLECTION':
      return {
        ...state,
        collection: state.collection.filter(c => c.beanId !== action.beanId),
        currentView: state.selectedBeanId === action.beanId ? 'list' : state.currentView,
        selectedBeanId: state.selectedBeanId === action.beanId ? null : state.selectedBeanId,
      };

    case 'UPDATE_COLLECTION_ITEM': {
      return {
        ...state,
        collection: state.collection.map(c =>
          c.beanId === action.beanId ? { ...c, ...action.updates } : c
        ),
      };
    }

    case 'SET_SEARCH':
      return { ...state, searchQuery: action.query };

    case 'SHOW_TOAST':
      return { ...state, toast: action.toast };

    case 'HIDE_TOAST':
      return { ...state, toast: null };

    case 'DISMISS_FIRST_USE':
      return { ...state, firstUse: false };

    case 'START_ADD_MANUAL':
      return {
        ...state,
        activeTab: 'add',
        currentView: 'addManual',
        addStep: 0,
        addDraft: {
          roastery: '', roasteryCity: '', name: '', origin: '', region: '',
          processing: 'washed', roast: 'medium', variety: '', altitude: '',
          flavorNotes: [],
        },
      };

    case 'UPDATE_ADD_DRAFT':
      return {
        ...state,
        addDraft: { ...state.addDraft, ...action.updates },
      };

    case 'SET_ADD_STEP':
      return { ...state, addStep: action.step };

    case 'SAVE_CUSTOM_BEAN': {
      const draft = state.addDraft;
      if (!draft || !draft.roastery || !draft.name) return state;
      const newBean = {
        id: Date.now(),
        ...draft,
      };
      const emptyRecipes2 = {};
      DRINK_TYPES.forEach(dt => {
        emptyRecipes2[dt.id] = { grind: null, dose: null, yield: null, time: null };
      });
      const collectionItem = {
        id: Date.now() + 1,
        beanId: newBean.id,
        bean: newBean,
        addedAt: new Date().toISOString(),
        rating: null,
        flavorNotes: [],
        tasteProfile: { acidity: 0, sweetness: 0, body: 0, bitterness: 0, aftertaste: 0 },
        recipes: emptyRecipes2,
        notes: '',
      };
      return {
        ...state,
        collection: [collectionItem, ...state.collection],
        activeTab: 'collection',
        currentView: 'list',
        addStep: 0,
        addDraft: null,
        firstUse: false,
      };
    }

    default:
      return state;
  }
}

// ──────────────────────────────────────────────
// Toast Hook
// ──────────────────────────────────────────────

function useToast(dispatch) {
  const timeoutRef = useRef(null);

  const showToast = useCallback((message, undoAction = null) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    dispatch({ type: 'SHOW_TOAST', toast: { message, undoAction } });
    timeoutRef.current = setTimeout(() => {
      dispatch({ type: 'HIDE_TOAST' });
    }, 4000);
  }, [dispatch]);

  const hideToast = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    dispatch({ type: 'HIDE_TOAST' });
  }, [dispatch]);

  return { showToast, hideToast };
}

// ──────────────────────────────────────────────
// Shared Components
// ──────────────────────────────────────────────

function RoastIndicator({ roast, size = 'sm' }) {
  const level = ROAST_LEVELS.find(r => r.id === roast) || ROAST_LEVELS[2];
  const idx = ROAST_LEVELS.findIndex(r => r.id === roast);
  const w = size === 'sm' ? 'w-16' : 'w-24';
  const h = size === 'sm' ? 'h-2' : 'h-3';

  return (
    <div className="flex items-center gap-2">
      <div className={`${w} ${h} rounded-full overflow-hidden bg-[var(--color-cream-dark)] relative`}>
        {/* Röstgrad als visueller Gradient — nicht nur Text */}
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-300`}
          style={{
            width: `${((idx + 1) / ROAST_LEVELS.length) * 100}%`,
            background: `linear-gradient(90deg, #D4A76A, ${level.color})`,
          }}
        />
      </div>
      {size !== 'sm' && (
        <span className="text-xs font-medium" style={{ color: level.color }}>
          {level.label}
        </span>
      )}
    </div>
  );
}

function StarRating({ rating, onChange, size = 'md' }) {
  const [hover, setHover] = useState(null);
  const starSize = size === 'md' ? 24 : size === 'lg' ? 32 : 18;
  const displayRating = hover ?? rating ?? 0;

  return (
    <div
      className="inline-flex items-center gap-0.5"
      role="radiogroup"
      aria-label="Bewertung"
    >
      {[1, 2, 3, 4, 5].map(star => {
        const filled = displayRating >= star;
        const halfFilled = !filled && displayRating >= star - 0.5;
        return (
          <button
            key={star}
            type="button"
            className="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-caramel)] rounded"
            style={{ width: starSize, height: starSize, minWidth: starSize, minHeight: starSize }}
            onMouseEnter={() => onChange && setHover(star)}
            onMouseLeave={() => setHover(null)}
            onClick={() => {
              if (!onChange) return;
              // Tap on same star toggles half-star
              if (rating === star) onChange(star - 0.5);
              else if (rating === star - 0.5) onChange(0);
              else onChange(star);
            }}
            aria-label={`${star} Sterne`}
            role="radio"
            aria-checked={rating === star}
          >
            <Star
              size={starSize}
              className={`transition-colors ${
                filled
                  ? 'fill-[var(--color-caramel)] text-[var(--color-caramel)]'
                  : halfFilled
                    ? 'text-[var(--color-caramel)]'
                    : 'text-[var(--color-cream-dark)] fill-[var(--color-cream-dark)]'
              }`}
            />
            {halfFilled && (
              <Star
                size={starSize}
                className="absolute inset-0 fill-[var(--color-caramel)] text-[var(--color-caramel)]"
                style={{ clipPath: 'inset(0 50% 0 0)' }}
              />
            )}
          </button>
        );
      })}
      {rating > 0 && (
        <span className="ml-2 text-sm font-semibold text-[var(--color-text-secondary)]">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

function FlavorTag({ label, selected, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-caramel)]
        ${selected
          ? 'bg-[var(--color-caramel)] text-white shadow-sm'
          : 'bg-[var(--color-cream)] text-[var(--color-text-secondary)] hover:bg-[var(--color-cream-dark)]'
        }`}
      style={{ minHeight: 36 }} // Touch target: 44px with padding
    >
      {label}
    </button>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl p-4 space-y-3">
      <div className="skeleton h-5 w-24" />
      <div className="skeleton h-6 w-40" />
      <div className="skeleton h-4 w-32" />
      <div className="flex gap-2 mt-3">
        <div className="skeleton h-4 w-16" />
        <div className="skeleton h-4 w-20" />
      </div>
    </div>
  );
}

function Toast({ toast, onDismiss, onUndo }) {
  if (!toast) return null;
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-32px)] max-w-[398px]">
      <div className="toast-enter bg-[var(--color-espresso)] text-white rounded-xl px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <Check size={18} className="text-[var(--color-success)] shrink-0" />
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
        {toast.undoAction && (
          <button
            onClick={() => { onUndo(); onDismiss(); }}
            className="flex items-center gap-1 text-[var(--color-gold)] text-sm font-semibold ml-3 shrink-0
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] rounded px-2 py-1"
            style={{ minHeight: 44, minWidth: 44 }}
          >
            <Undo2 size={14} />
            Undo
          </button>
        )}
      </div>
    </div>
  );
}

function EmptyCollection({ onDiscover, onAdd }) {
  // Empty State: Zeigarnik Effect — motivate completion
  return (
    <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-[var(--color-cream)] flex items-center justify-center mb-6">
        <Coffee size={36} className="text-[var(--color-caramel)]" />
      </div>
      <h2 className="font-[var(--font-display)] text-2xl text-[var(--color-text-primary)] mb-2"
        style={{ fontFamily: 'var(--font-display)' }}>
        Deine Sammlung ist leer
      </h2>
      <p className="text-[var(--color-text-muted)] text-sm mb-8 max-w-[260px]">
        Entdecke Specialty Coffee aus ganz Deutschland und starte deine persönliche Kollektion.
      </p>
      <div className="flex flex-col gap-3 w-full max-w-[240px]">
        <button
          onClick={onDiscover}
          className="w-full py-3 px-6 bg-[var(--color-caramel)] text-white rounded-xl font-semibold text-sm
            hover:bg-[var(--color-roast-light)] transition-colors
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-caramel)] focus-visible:ring-offset-2"
          style={{ minHeight: 48 }}
        >
          Bohnen entdecken
        </button>
        <button
          onClick={onAdd}
          className="w-full py-3 px-6 bg-transparent border-2 border-[var(--color-cream-dark)] text-[var(--color-text-secondary)]
            rounded-xl font-semibold text-sm hover:border-[var(--color-copper)] transition-colors
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-caramel)] focus-visible:ring-offset-2"
          style={{ minHeight: 48 }}
        >
          Eigene Bohne anlegen
        </button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Bean Card Component
// ──────────────────────────────────────────────

function BeanCard({ collectionItem, onClick }) {
  const { bean, rating, flavorNotes, tasteProfile } = collectionItem;
  const hasRating = rating !== null && rating > 0;
  const hasTaste = Object.values(tasteProfile).some(v => v > 0);
  const isComplete = hasRating && hasTaste && flavorNotes.length > 0;

  // Partial State: Zeigarnik Effect — visually indicate incomplete, invite completion
  const completionPercent = [
    hasRating ? 1 : 0,
    hasTaste ? 1 : 0,
    flavorNotes.length > 0 ? 1 : 0,
  ].reduce((a, b) => a + b, 0) / 3 * 100;

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-2xl p-4 shadow-[0_1px_4px_rgba(44,24,16,0.06),0_4px_12px_rgba(44,24,16,0.04)]
        hover:shadow-[0_2px_8px_rgba(44,24,16,0.1),0_8px_24px_rgba(44,24,16,0.06)]
        transition-shadow duration-200 group
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-caramel)] focus-visible:ring-offset-2"
      style={{ minHeight: 48 }}
    >
      {/* Serial Position Effect: Wichtigste Info (Rösterei, Rating) oben */}
      <div className="flex items-start justify-between mb-1">
        <span className="text-xs font-semibold text-[var(--color-caramel)] uppercase tracking-wide">
          {bean.roastery}
        </span>
        {hasRating && <StarRating rating={rating} size="xs" />}
      </div>

      <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-1 leading-tight"
        style={{ fontFamily: 'var(--font-display)' }}>
        {bean.name}
      </h3>

      <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-3">
        <span>{COUNTRY_FLAGS[bean.origin] || '🌍'} {bean.origin}</span>
        <span className="text-[var(--color-cream-dark)]">·</span>
        <span className="capitalize">{PROCESSING_METHODS.find(p => p.id === bean.processing)?.label || bean.processing}</span>
      </div>

      <div className="flex items-center justify-between">
        <RoastIndicator roast={bean.roast} />
        {!isComplete && (
          // Zeigarnik: show progress bar for incomplete items
          <div className="flex items-center gap-2">
            <div className="w-12 h-1.5 rounded-full bg-[var(--color-cream-dark)] overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--color-gold)] transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-[var(--color-text-muted)]">
              {Math.round(completionPercent)}%
            </span>
          </div>
        )}
        {isComplete && (
          <span className="text-xs text-[var(--color-success)] flex items-center gap-1">
            <Check size={12} />
            Komplett
          </span>
        )}
      </div>

      {flavorNotes.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {flavorNotes.slice(0, 3).map(note => (
            <span key={note} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-cream)] text-[var(--color-text-secondary)]">
              {note}
            </span>
          ))}
          {flavorNotes.length > 3 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-cream)] text-[var(--color-text-muted)]">
              +{flavorNotes.length - 3}
            </span>
          )}
        </div>
      )}
    </button>
  );
}

// ──────────────────────────────────────────────
// Recipe Tracker — Niche Zero grind + dose/yield/time per drink type
// ──────────────────────────────────────────────

function RecipeTracker({ recipes, onChange }) {
  const [expandedDrink, setExpandedDrink] = useState(null);

  const updateRecipe = (drinkId, field, value) => {
    onChange({
      ...recipes,
      [drinkId]: { ...recipes[drinkId], [field]: value },
    });
  };

  const initRecipeWithDefaults = (drinkId) => {
    const dt = DRINK_TYPES.find(d => d.id === drinkId);
    onChange({
      ...recipes,
      [drinkId]: { ...dt.defaults },
    });
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(44,24,16,0.06)]">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wide flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-[var(--color-caramel)]" />
          Rezepte
        </h3>
        <span className="text-[10px] text-[var(--color-text-muted)] bg-[var(--color-cream)] px-2 py-0.5 rounded-full">
          {GRINDER.name}
        </span>
      </div>
      <p className="text-xs text-[var(--color-text-muted)] mb-4">
        Mahlgrad, Dosis, Ertrag & Durchlaufzeit pro Getränk
      </p>

      <div className="space-y-3">
        {DRINK_TYPES.map(dt => {
          const recipe = recipes[dt.id] || {};
          const isExpanded = expandedDrink === dt.id;
          const hasValues = recipe.grind !== null;
          const ratio = recipe.dose && recipe.yield
            ? (recipe.yield / recipe.dose).toFixed(1)
            : null;

          return (
            <div
              key={dt.id}
              className={`rounded-xl border transition-all duration-200 ${
                isExpanded
                  ? 'border-[var(--color-caramel)]/30 bg-[var(--color-cream)]/30'
                  : 'border-[var(--color-cream-dark)]'
              }`}
            >
              {/* Drink header — tap to expand */}
              <button
                onClick={() => {
                  if (!hasValues && !isExpanded) {
                    initRecipeWithDefaults(dt.id);
                  }
                  setExpandedDrink(isExpanded ? null : dt.id);
                }}
                className="w-full flex items-center justify-between px-4 py-3
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-caramel)] rounded-xl"
                style={{ minHeight: 48 }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{dt.emoji}</span>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {dt.label}
                    </p>
                    {hasValues && !isExpanded && (
                      <p className="text-[11px] text-[var(--color-text-muted)] tabular-nums mt-0.5">
                        {recipe.grind} · {recipe.dose}g → {recipe.yield}g · {recipe.time}s
                        {ratio && <span className="text-[var(--color-caramel)]"> (1:{ratio})</span>}
                      </p>
                    )}
                    {!hasValues && !isExpanded && (
                      <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                        Noch nicht eingestellt
                      </p>
                    )}
                  </div>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-[var(--color-text-muted)] transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Expanded recipe editor */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-4">
                  {/* Grind — Niche Zero slider 0-50 */}
                  <RecipeSlider
                    icon={<CircleDot size={14} />}
                    label="Mahlgrad"
                    sublabel={GRINDER.name}
                    value={recipe.grind}
                    min={GRINDER.min}
                    max={GRINDER.max}
                    step={GRINDER.step}
                    unit=""
                    leftHint="Fein"
                    rightHint="Grob"
                    onChange={v => updateRecipe(dt.id, 'grind', v)}
                  />

                  {/* Dose (grams in) */}
                  <RecipeSlider
                    icon={<Weight size={14} />}
                    label="Dosis"
                    value={recipe.dose}
                    min={5}
                    max={25}
                    step={0.5}
                    unit="g"
                    onChange={v => updateRecipe(dt.id, 'dose', v)}
                  />

                  {/* Yield (grams out) */}
                  <RecipeSlider
                    icon={<GlassWater size={14} />}
                    label="Ertrag"
                    value={recipe.yield}
                    min={dt.id === 'cafe-creme' ? 60 : 15}
                    max={dt.id === 'cafe-creme' ? 200 : 60}
                    step={1}
                    unit="g"
                    onChange={v => updateRecipe(dt.id, 'yield', v)}
                  />

                  {/* Brew time */}
                  <RecipeSlider
                    icon={<Timer size={14} />}
                    label="Durchlaufzeit"
                    value={recipe.time}
                    min={15}
                    max={45}
                    step={1}
                    unit="s"
                    onChange={v => updateRecipe(dt.id, 'time', v)}
                  />

                  {/* Ratio display */}
                  {recipe.dose && recipe.yield && (
                    <div className="flex items-center justify-center gap-2 pt-2 border-t border-[var(--color-cream-dark)]">
                      <span className="text-xs text-[var(--color-text-muted)]">Verhältnis</span>
                      <span className="text-sm font-bold text-[var(--color-caramel)] tabular-nums">
                        1 : {(recipe.yield / recipe.dose).toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RecipeSlider({ icon, label, sublabel, value, min, max, step, unit, leftHint, rightHint, onChange }) {
  const displayValue = value !== null && value !== undefined
    ? `${value % 1 === 0 ? value : value.toFixed(1)}${unit}`
    : '–';

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[var(--color-roast)]">{icon}</span>
          <span className="text-xs font-medium text-[var(--color-text-primary)]">{label}</span>
          {sublabel && (
            <span className="text-[10px] text-[var(--color-text-muted)]">({sublabel})</span>
          )}
        </div>
        <span className="text-sm font-bold text-[var(--color-caramel)] tabular-nums min-w-[4ch] text-right">
          {displayValue}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {leftHint && <span className="text-[10px] text-[var(--color-text-muted)] w-6 text-right shrink-0">{leftHint}</span>}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value ?? min}
          onChange={e => onChange(parseFloat(e.target.value))}
          className="flex-1"
          aria-label={label}
        />
        {rightHint && <span className="text-[10px] text-[var(--color-text-muted)] w-6 shrink-0">{rightHint}</span>}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Collection View
// ──────────────────────────────────────────────

function CollectionView({ state, dispatch, showToast }) {
  const { collection } = state;

  if (collection.length === 0) {
    return (
      <EmptyCollection
        onDiscover={() => dispatch({ type: 'NAVIGATE_TAB', tab: 'discover' })}
        onAdd={() => dispatch({ type: 'START_ADD_MANUAL' })}
      />
    );
  }

  return (
    <div className="px-4 pt-4 pb-4">
      {/* Header */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <h1 className="text-2xl font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Meine Sammlung
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            {collection.length} {collection.length === 1 ? 'Bohne' : 'Bohnen'}
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="space-y-3">
        {collection.map(item => (
          <BeanCard
            key={item.id}
            collectionItem={item}
            onClick={() => dispatch({ type: 'VIEW_BEAN_DETAIL', beanId: item.beanId })}
          />
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Discover View (Datenbank)
// ──────────────────────────────────────────────

function DiscoverView({ state, dispatch, showToast }) {
  const { searchQuery, collection } = state;
  const groupedRoasteries = useMemo(() => getRoasteriesGrouped(), []);

  const filteredGrouped = useMemo(() => {
    if (!searchQuery.trim()) return groupedRoasteries;
    const q = searchQuery.toLowerCase();
    const result = {};
    Object.entries(groupedRoasteries).forEach(([letter, roasteries]) => {
      const filtered = roasteries
        .map(r => ({
          ...r,
          beans: r.beans.filter(b =>
            b.name.toLowerCase().includes(q) ||
            b.roastery.toLowerCase().includes(q) ||
            b.origin.toLowerCase().includes(q) ||
            b.region.toLowerCase().includes(q)
          ),
        }))
        .filter(r => r.beans.length > 0);
      if (filtered.length > 0) result[letter] = filtered;
    });
    return result;
  }, [searchQuery, groupedRoasteries]);

  const letters = Object.keys(filteredGrouped).sort((a, b) => a.localeCompare(b, 'de'));
  const hasResults = letters.length > 0;
  const collectionBeanIds = new Set(collection.map(c => c.beanId));

  return (
    <div className="px-4 pt-4 pb-4">
      <h1 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
        Entdecken
      </h1>

      {/* Search — Recognition over Recall */}
      <div className="relative mb-5">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => dispatch({ type: 'SET_SEARCH', query: e.target.value })}
          placeholder="Rösterei, Bohne oder Herkunft suchen..."
          className="w-full pl-10 pr-10 py-3 bg-[var(--color-cream)] rounded-xl text-sm
            placeholder:text-[var(--color-text-muted)]
            focus:outline-none focus:ring-2 focus:ring-[var(--color-caramel)] focus:bg-white transition-colors"
          style={{ minHeight: 48 }}
        />
        {searchQuery && (
          <button
            onClick={() => dispatch({ type: 'SET_SEARCH', query: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]
              hover:text-[var(--color-text-secondary)] p-1
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-caramel)] rounded"
            style={{ minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Empty search state */}
      {!hasResults && searchQuery && (
        <div className="text-center py-12">
          <Search size={40} className="mx-auto text-[var(--color-cream-dark)] mb-4" />
          <p className="text-[var(--color-text-secondary)] font-medium mb-1">
            Keine Ergebnisse für &ldquo;{searchQuery}&rdquo;
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">
            Probiere einen anderen Suchbegriff oder{' '}
            <button
              onClick={() => dispatch({ type: 'START_ADD_MANUAL' })}
              className="text-[var(--color-caramel)] underline focus:outline-none"
            >
              lege eine eigene Bohne an
            </button>
          </p>
        </div>
      )}

      {/* Miller's Law: alphabetisch gruppiert mit Sticky-Headers */}
      {letters.map(letter => (
        <div key={letter} className="mb-4">
          <div className="sticky top-0 z-10 bg-[var(--color-milk)]/95 backdrop-blur-sm py-1 mb-2">
            <span className="text-xs font-bold text-[var(--color-caramel)] uppercase tracking-widest">
              {letter}
            </span>
          </div>
          {filteredGrouped[letter].map(roastery => (
            <div key={roastery.name} className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                  {roastery.name}
                </h3>
                <span className="text-xs text-[var(--color-text-muted)]">
                  {roastery.city}
                </span>
              </div>
              <div className="space-y-2">
                {roastery.beans.map(bean => {
                  const inCollection = collectionBeanIds.has(bean.id);
                  return (
                    <div
                      key={bean.id}
                      className="flex items-center justify-between bg-white rounded-xl px-3 py-3
                        shadow-[0_1px_3px_rgba(44,24,16,0.04)]"
                    >
                      <button
                        onClick={() => dispatch({ type: 'VIEW_BEAN_DETAIL', beanId: bean.id })}
                        className="flex-1 text-left mr-3 focus:outline-none focus-visible:ring-2
                          focus-visible:ring-[var(--color-caramel)] rounded-lg p-1 -m-1"
                        style={{ minHeight: 44 }}
                      >
                        <p className="text-sm font-medium text-[var(--color-text-primary)] leading-tight">
                          {bean.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-[var(--color-text-muted)]">
                            {COUNTRY_FLAGS[bean.origin] || '🌍'} {bean.origin}
                          </span>
                          <RoastIndicator roast={bean.roast} size="sm" />
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          if (inCollection) {
                            dispatch({ type: 'REMOVE_FROM_COLLECTION', beanId: bean.id });
                            showToast('Bohne entfernt', () => dispatch({ type: 'ADD_TO_COLLECTION', beanId: bean.id }));
                          } else {
                            dispatch({ type: 'ADD_TO_COLLECTION', beanId: bean.id });
                            showToast('Zur Sammlung hinzugefügt', () => dispatch({ type: 'REMOVE_FROM_COLLECTION', beanId: bean.id }));
                          }
                        }}
                        className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-caramel)]
                          ${inCollection
                            ? 'bg-[var(--color-success)] text-white'
                            : 'bg-[var(--color-cream)] text-[var(--color-caramel)] hover:bg-[var(--color-cream-dark)]'
                          }`}
                        style={{ minWidth: 44, minHeight: 44 }}
                        aria-label={inCollection ? 'Aus Sammlung entfernen' : 'Zur Sammlung hinzufügen'}
                      >
                        {inCollection ? <Check size={16} /> : <Plus size={16} />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────
// Bean Detail View
// ──────────────────────────────────────────────

function BeanDetailView({ state, dispatch, showToast }) {
  const { selectedBeanId, collection } = state;
  const [showAllTags, setShowAllTags] = useState(false);

  // Find bean — either from collection or database
  const collectionItem = collection.find(c => c.beanId === selectedBeanId);
  const bean = collectionItem?.bean || COFFEE_DATABASE.find(b => b.id === selectedBeanId);
  const inCollection = !!collectionItem;

  if (!bean) {
    return (
      <div className="p-4 text-center py-12">
        <AlertCircle size={40} className="mx-auto text-[var(--color-error)] mb-4" />
        <p className="text-[var(--color-text-secondary)]">Bohne nicht gefunden</p>
        <button
          onClick={() => dispatch({ type: 'BACK_TO_LIST' })}
          className="mt-4 text-[var(--color-caramel)] font-medium"
        >
          Zurück
        </button>
      </div>
    );
  }

  const roastLevel = ROAST_LEVELS.find(r => r.id === bean.roast) || ROAST_LEVELS[2];
  const processing = PROCESSING_METHODS.find(p => p.id === bean.processing);

  // Radar chart data
  const radarData = collectionItem ? [
    { axis: 'Säure', value: collectionItem.tasteProfile.acidity },
    { axis: 'Süße', value: collectionItem.tasteProfile.sweetness },
    { axis: 'Körper', value: collectionItem.tasteProfile.body },
    { axis: 'Bitter', value: collectionItem.tasteProfile.bitterness },
    { axis: 'Nachgeschmack', value: collectionItem.tasteProfile.aftertaste },
  ] : [];

  const hasAnyTaste = radarData.some(d => d.value > 0);

  // Hick's Law: max 6 tags visible initially
  const visibleTags = showAllTags ? FLAVOR_NOTES : FLAVOR_NOTES.slice(0, INITIAL_VISIBLE_TAGS);

  return (
    <div className="pb-6">
      {/* Header with back button */}
      <div className="sticky top-0 z-20 bg-[var(--color-milk)]/95 backdrop-blur-sm px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => dispatch({ type: 'BACK_TO_LIST' })}
          className="w-10 h-10 rounded-full bg-[var(--color-cream)] flex items-center justify-center
            hover:bg-[var(--color-cream-dark)] transition-colors
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-caramel)]"
          style={{ minWidth: 44, minHeight: 44 }}
          aria-label="Zurück"
        >
          <ChevronLeft size={20} className="text-[var(--color-text-primary)]" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-[var(--color-caramel)] uppercase tracking-wide truncate">
            {bean.roastery}
          </p>
          <h2 className="text-lg font-semibold truncate" style={{ fontFamily: 'var(--font-display)' }}>
            {bean.name}
          </h2>
        </div>
        {!inCollection && (
          <button
            onClick={() => {
              dispatch({ type: 'ADD_TO_COLLECTION', beanId: bean.id });
              showToast('Zur Sammlung hinzugefügt');
            }}
            className="shrink-0 px-4 py-2 bg-[var(--color-caramel)] text-white rounded-lg text-sm font-semibold
              hover:bg-[var(--color-roast-light)] transition-colors
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-caramel)]"
            style={{ minHeight: 44 }}
          >
            Sammeln
          </button>
        )}
      </div>

      <div className="px-4 space-y-6 mt-2">
        {/* Bean Info Card — Law of Common Region */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(44,24,16,0.06)]">
          {/* Origin with flag */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{COUNTRY_FLAGS[bean.origin] || '🌍'}</span>
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">{bean.origin}</p>
              {bean.region && (
                <p className="text-xs text-[var(--color-text-muted)]">{bean.region}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InfoItem icon={<Layers size={14} />} label="Verarbeitung" value={processing?.label || bean.processing} />
            <InfoItem icon={<Flame size={14} />} label="Röstgrad" value={<RoastIndicator roast={bean.roast} size="md" />} />
            {bean.variety && (
              <InfoItem icon={<Sparkles size={14} />} label="Varietät" value={bean.variety} />
            )}
            {bean.altitude && (
              <InfoItem icon={<Mountain size={14} />} label="Höhenlage" value={bean.altitude} />
            )}
          </div>

          {/* Default flavor notes from database */}
          {bean.flavorNotes && bean.flavorNotes.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[var(--color-cream)]">
              <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-2">
                Typische Aromen
              </p>
              <div className="flex flex-wrap gap-1.5">
                {bean.flavorNotes.map(note => (
                  <span key={note} className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-cream)] text-[var(--color-text-secondary)] font-medium">
                    {note}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Only show editable sections if in collection ── */}
        {inCollection && (
          <>
            {/* Brewing Recipes — per drink type */}
            <RecipeTracker
              recipes={collectionItem.recipes}
              onChange={recipes =>
                dispatch({
                  type: 'UPDATE_COLLECTION_ITEM',
                  beanId: bean.id,
                  updates: { recipes },
                })
              }
            />

            {/* Rating Section */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(44,24,16,0.06)]">
              <h3 className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wide mb-4 flex items-center gap-2">
                <Star size={16} className="text-[var(--color-caramel)]" />
                Deine Bewertung
              </h3>

              {/* Overall Rating */}
              <div className="mb-6">
                <p className="text-xs text-[var(--color-text-muted)] mb-2">Gesamtbewertung</p>
                <StarRating
                  rating={collectionItem.rating || 0}
                  onChange={rating =>
                    dispatch({
                      type: 'UPDATE_COLLECTION_ITEM',
                      beanId: bean.id,
                      updates: { rating },
                    })
                  }
                  size="lg"
                />
              </div>

              {/* Flavor Notes Tags */}
              <div className="mb-6">
                <p className="text-xs text-[var(--color-text-muted)] mb-2">Deine Geschmacksnotizen</p>
                {/* Hick's Law: max 6 tags visible initially */}
                <div className="flex flex-wrap gap-2">
                  {visibleTags.map(note => (
                    <FlavorTag
                      key={note}
                      label={note}
                      selected={collectionItem.flavorNotes.includes(note)}
                      onToggle={() => {
                        const notes = collectionItem.flavorNotes.includes(note)
                          ? collectionItem.flavorNotes.filter(n => n !== note)
                          : [...collectionItem.flavorNotes, note];
                        dispatch({
                          type: 'UPDATE_COLLECTION_ITEM',
                          beanId: bean.id,
                          updates: { flavorNotes: notes },
                        });
                      }}
                    />
                  ))}
                </div>
                {FLAVOR_NOTES.length > INITIAL_VISIBLE_TAGS && (
                  <button
                    onClick={() => setShowAllTags(!showAllTags)}
                    className="mt-2 text-xs text-[var(--color-caramel)] font-medium flex items-center gap-1
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-caramel)] rounded px-1"
                    style={{ minHeight: 44 }}
                  >
                    {showAllTags ? (
                      <><ChevronUp size={14} /> Weniger anzeigen</>
                    ) : (
                      <><ChevronDown size={14} /> {FLAVOR_NOTES.length - INITIAL_VISIBLE_TAGS} weitere Aromen</>
                    )}
                  </button>
                )}
              </div>

              {/* Taste Profile Radar Chart */}
              <div className="mb-6">
                <p className="text-xs text-[var(--color-text-muted)] mb-3">Geschmacksprofil</p>
                {hasAnyTaste ? (
                  <div className="w-full h-[220px]">
                    <ResponsiveContainer>
                      <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                        <PolarGrid stroke="var(--color-cream-dark)" />
                        <PolarAngleAxis
                          dataKey="axis"
                          tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
                        />
                        <Radar
                          dataKey="value"
                          stroke="var(--color-caramel)"
                          fill="var(--color-caramel)"
                          fillOpacity={0.2}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-xs text-[var(--color-text-muted)] text-center py-4">
                    Bewerte die Achsen unten, um dein Geschmacksprofil zu sehen
                  </p>
                )}

                {/* Taste sliders */}
                <div className="space-y-3 mt-3">
                  {[
                    { key: 'acidity', label: 'Säure' },
                    { key: 'sweetness', label: 'Süße' },
                    { key: 'body', label: 'Körper' },
                    { key: 'bitterness', label: 'Bitterkeit' },
                    { key: 'aftertaste', label: 'Nachgeschmack' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-3">
                      <span className="text-xs text-[var(--color-text-secondary)] w-24 shrink-0">{label}</span>
                      <input
                        type="range"
                        min={0}
                        max={5}
                        step={1}
                        value={collectionItem.tasteProfile[key]}
                        onChange={e =>
                          dispatch({
                            type: 'UPDATE_COLLECTION_ITEM',
                            beanId: bean.id,
                            updates: {
                              tasteProfile: {
                                ...collectionItem.tasteProfile,
                                [key]: parseInt(e.target.value),
                              },
                            },
                          })
                        }
                        className="flex-1"
                        aria-label={label}
                      />
                      <span className="text-xs font-semibold text-[var(--color-caramel)] w-4 text-right tabular-nums">
                        {collectionItem.tasteProfile[key]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Notes */}
              <div>
                <p className="text-xs text-[var(--color-text-muted)] mb-2 flex items-center gap-1">
                  <Pen size={12} />
                  Persönliche Notizen
                </p>
                <textarea
                  value={collectionItem.notes}
                  onChange={e =>
                    dispatch({
                      type: 'UPDATE_COLLECTION_ITEM',
                      beanId: bean.id,
                      updates: { notes: e.target.value },
                    })
                  }
                  placeholder="Wie schmeckt dir diese Bohne? Besondere Zubereitung?"
                  className="w-full p-3 bg-[var(--color-cream)] rounded-xl text-sm resize-none h-24
                    placeholder:text-[var(--color-text-muted)]
                    focus:outline-none focus:ring-2 focus:ring-[var(--color-caramel)] focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Remove from collection */}
            <button
              onClick={() => {
                const removedItem = collectionItem;
                dispatch({ type: 'REMOVE_FROM_COLLECTION', beanId: bean.id });
                showToast('Bohne entfernt', () => {
                  // Undo: re-add with all data
                  dispatch({ type: 'ADD_TO_COLLECTION', beanId: bean.id });
                  // Restore ratings etc.
                  dispatch({
                    type: 'UPDATE_COLLECTION_ITEM',
                    beanId: bean.id,
                    updates: {
                      rating: removedItem.rating,
                      flavorNotes: removedItem.flavorNotes,
                      tasteProfile: removedItem.tasteProfile,
                      recipes: removedItem.recipes,
                      notes: removedItem.notes,
                    },
                  });
                });
              }}
              className="w-full py-3 text-sm text-[var(--color-error)] font-medium
                hover:bg-[var(--color-cream)] rounded-xl transition-colors
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-error)]"
              style={{ minHeight: 48 }}
            >
              Aus Sammlung entfernen
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div>
      <div className="flex items-center gap-1 mb-0.5">
        <span className="text-[var(--color-text-muted)]">{icon}</span>
        <span className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className="text-sm text-[var(--color-text-primary)] font-medium">
        {value}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Add View
// ──────────────────────────────────────────────

function AddView({ state, dispatch, showToast }) {
  if (state.currentView === 'addManual') {
    return <AddManualFlow state={state} dispatch={dispatch} showToast={showToast} />;
  }

  return (
    <div className="px-4 pt-4 pb-4">
      <h1 className="text-2xl font-semibold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
        Bohne hinzufügen
      </h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-8">
        Wähle eine Bohne aus unserer Datenbank oder lege eine eigene an.
      </p>

      {/* Two paths — Progressive Disclosure */}
      <div className="space-y-3">
        <button
          onClick={() => dispatch({ type: 'NAVIGATE_TAB', tab: 'discover' })}
          className="w-full bg-white rounded-2xl p-5 text-left flex items-center gap-4
            shadow-[0_1px_4px_rgba(44,24,16,0.06)] hover:shadow-[0_2px_8px_rgba(44,24,16,0.1)]
            transition-shadow
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-caramel)]"
          style={{ minHeight: 48 }}
        >
          <div className="w-12 h-12 rounded-full bg-[var(--color-cream)] flex items-center justify-center shrink-0">
            <Search size={22} className="text-[var(--color-caramel)]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">Aus Datenbank wählen</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              {COFFEE_DATABASE.length} Bohnen von {new Set(COFFEE_DATABASE.map(b => b.roastery)).size} Röstereien
            </p>
          </div>
          <ArrowRight size={18} className="text-[var(--color-text-muted)] shrink-0" />
        </button>

        <button
          onClick={() => dispatch({ type: 'START_ADD_MANUAL' })}
          className="w-full bg-white rounded-2xl p-5 text-left flex items-center gap-4
            shadow-[0_1px_4px_rgba(44,24,16,0.06)] hover:shadow-[0_2px_8px_rgba(44,24,16,0.1)]
            transition-shadow
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-caramel)]"
          style={{ minHeight: 48 }}
        >
          <div className="w-12 h-12 rounded-full bg-[var(--color-cream)] flex items-center justify-center shrink-0">
            <Pen size={22} className="text-[var(--color-caramel)]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">Eigene Bohne anlegen</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              Rösterei, Bohne, Herkunft manuell eingeben
            </p>
          </div>
          <ArrowRight size={18} className="text-[var(--color-text-muted)] shrink-0" />
        </button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Add Manual Flow — One-Thing-Per-Page
// ──────────────────────────────────────────────

const ADD_STEPS = [
  { title: 'Rösterei & Bohne', subtitle: 'Das Wichtigste zuerst' },
  { title: 'Herkunft & Details', subtitle: 'Woher kommt die Bohne?' },
  { title: 'Röstung & Verarbeitung', subtitle: 'Fast geschafft!' },
];

function AddManualFlow({ state, dispatch, showToast }) {
  const { addStep, addDraft } = state;
  if (!addDraft) return null;

  const step = ADD_STEPS[addStep];
  const canProceed = addStep === 0
    ? addDraft.roastery.trim() && addDraft.name.trim()
    : true;

  const isLastStep = addStep === ADD_STEPS.length - 1;

  return (
    <div className="px-4 pt-4 pb-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => {
            if (addStep > 0) {
              dispatch({ type: 'SET_ADD_STEP', step: addStep - 1 });
            } else {
              dispatch({ type: 'NAVIGATE_TAB', tab: 'add' });
            }
          }}
          className="w-10 h-10 rounded-full bg-[var(--color-cream)] flex items-center justify-center
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-caramel)]"
          style={{ minWidth: 44, minHeight: 44 }}
          aria-label="Zurück"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1">
          <p className="text-xs text-[var(--color-caramel)] font-semibold">
            Schritt {addStep + 1} von {ADD_STEPS.length}
          </p>
          <h2 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
            {step.title}
          </h2>
        </div>
      </div>

      {/* Step progress bar */}
      <div className="flex gap-1.5 mb-8">
        {ADD_STEPS.map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1 rounded-full transition-colors duration-300 ${
              i <= addStep ? 'bg-[var(--color-caramel)]' : 'bg-[var(--color-cream-dark)]'
            }`}
          />
        ))}
      </div>

      {/* Step Content — Progressive Disclosure */}
      <div className="space-y-5">
        {addStep === 0 && (
          <>
            <FormField
              label="Rösterei"
              value={addDraft.roastery}
              onChange={v => dispatch({ type: 'UPDATE_ADD_DRAFT', updates: { roastery: v } })}
              placeholder="z.B. The Barn"
              required
            />
            <FormField
              label="Stadt"
              value={addDraft.roasteryCity}
              onChange={v => dispatch({ type: 'UPDATE_ADD_DRAFT', updates: { roasteryCity: v } })}
              placeholder="z.B. Berlin"
            />
            <FormField
              label="Bohnen-Name"
              value={addDraft.name}
              onChange={v => dispatch({ type: 'UPDATE_ADD_DRAFT', updates: { name: v } })}
              placeholder="z.B. Nano Challa"
              required
            />
          </>
        )}

        {addStep === 1 && (
          <>
            <FormField
              label="Herkunftsland"
              value={addDraft.origin}
              onChange={v => dispatch({ type: 'UPDATE_ADD_DRAFT', updates: { origin: v } })}
              placeholder="z.B. Äthiopien"
            />
            <FormField
              label="Region"
              value={addDraft.region}
              onChange={v => dispatch({ type: 'UPDATE_ADD_DRAFT', updates: { region: v } })}
              placeholder="z.B. Yirgacheffe"
            />
            <FormField
              label="Varietät"
              value={addDraft.variety}
              onChange={v => dispatch({ type: 'UPDATE_ADD_DRAFT', updates: { variety: v } })}
              placeholder="z.B. Heirloom"
            />
            <FormField
              label="Höhenlage"
              value={addDraft.altitude}
              onChange={v => dispatch({ type: 'UPDATE_ADD_DRAFT', updates: { altitude: v } })}
              placeholder="z.B. 1800m"
            />
          </>
        )}

        {addStep === 2 && (
          <>
            {/* Röstgrad — Recognition over Recall: visual picker */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-2">
                Röstgrad
              </label>
              <div className="flex gap-2">
                {ROAST_LEVELS.map(level => (
                  <button
                    key={level.id}
                    onClick={() => dispatch({ type: 'UPDATE_ADD_DRAFT', updates: { roast: level.id } })}
                    className={`flex-1 py-3 rounded-xl text-center text-xs font-medium transition-all
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-caramel)]
                      ${addDraft.roast === level.id
                        ? 'ring-2 ring-[var(--color-caramel)] shadow-sm'
                        : 'hover:bg-[var(--color-cream-dark)]'
                      }`}
                    style={{
                      backgroundColor: addDraft.roast === level.id ? level.color + '20' : 'var(--color-cream)',
                      color: level.color,
                      minHeight: 48,
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full mx-auto mb-1"
                      style={{ backgroundColor: level.color }}
                    />
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Processing */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-2">
                Verarbeitung
              </label>
              <div className="flex gap-2">
                {PROCESSING_METHODS.map(method => (
                  <button
                    key={method.id}
                    onClick={() => dispatch({ type: 'UPDATE_ADD_DRAFT', updates: { processing: method.id } })}
                    className={`flex-1 py-3 rounded-xl text-center text-sm font-medium transition-all
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-caramel)]
                      ${addDraft.processing === method.id
                        ? 'bg-[var(--color-caramel)] text-white shadow-sm'
                        : 'bg-[var(--color-cream)] text-[var(--color-text-secondary)] hover:bg-[var(--color-cream-dark)]'
                      }`}
                    style={{ minHeight: 48 }}
                  >
                    {method.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-8 space-y-3">
        <button
          onClick={() => {
            if (isLastStep) {
              dispatch({ type: 'SAVE_CUSTOM_BEAN' });
              showToast('Bohne zur Sammlung hinzugefügt!');
            } else {
              dispatch({ type: 'SET_ADD_STEP', step: addStep + 1 });
            }
          }}
          disabled={!canProceed}
          className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-caramel)] focus-visible:ring-offset-2
            ${canProceed
              ? 'bg-[var(--color-caramel)] text-white hover:bg-[var(--color-roast-light)]'
              : 'bg-[var(--color-cream-dark)] text-[var(--color-text-muted)] cursor-not-allowed'
            }`}
          style={{ minHeight: 48 }}
        >
          {isLastStep ? 'Bohne speichern' : 'Weiter'}
        </button>

        {!isLastStep && addStep > 0 && (
          <button
            onClick={() => {
              // Skip optional details
              if (isLastStep) return;
              dispatch({ type: 'SET_ADD_STEP', step: addStep + 1 });
            }}
            className="w-full py-3 text-sm text-[var(--color-text-muted)] font-medium
              hover:text-[var(--color-text-secondary)] transition-colors
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-caramel)] rounded-xl"
            style={{ minHeight: 48 }}
          >
            Überspringen
          </button>
        )}
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, placeholder, required }) {
  return (
    <div>
      {/* No placeholder-only labels — proper labels above input (Anti-Pattern vermieden) */}
      <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-1.5">
        {label}
        {required && <span className="text-[var(--color-error)] ml-0.5">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-[var(--color-cream)] rounded-xl text-sm
          placeholder:text-[var(--color-text-muted)]
          focus:outline-none focus:ring-2 focus:ring-[var(--color-caramel)] focus:bg-white transition-colors"
        style={{ minHeight: 48 }}
      />
    </div>
  );
}

// ──────────────────────────────────────────────
// First Use Overlay
// ──────────────────────────────────────────────

function FirstUseHint({ onDismiss }) {
  // Non-blocking first use hint
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
      <div className="pointer-events-auto w-full max-w-[430px] px-4 pb-28">
        <div className="bg-[var(--color-espresso)] text-white rounded-2xl p-5 shadow-2xl relative">
          <button
            onClick={onDismiss}
            className="absolute top-3 right-3 text-white/60 hover:text-white
              focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded p-1"
            style={{ minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Schließen"
          >
            <X size={18} />
          </button>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-caramel)] flex items-center justify-center shrink-0 mt-0.5">
              <Coffee size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-base mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                Willkommen bei Grindy!
              </h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Entdecke Specialty Coffee Röstereien aus ganz Deutschland, sammle deine Lieblingsbohnen und dokumentiere den perfekten Mahlgrad.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Bottom Navigation
// ──────────────────────────────────────────────

function BottomNav({ activeTab, onNavigate, collectionCount }) {
  const tabs = [
    { id: 'collection', label: 'Sammlung', icon: Coffee, badge: collectionCount },
    { id: 'discover', label: 'Entdecken', icon: Search },
    { id: 'add', label: 'Hinzufügen', icon: Plus },
  ];

  return (
    <nav
      className="shrink-0 bg-white/95 backdrop-blur-md border-t border-[var(--color-cream-dark)]
        safe-area-bottom"
      role="tablist"
      aria-label="Hauptnavigation"
    >
      <div className="flex items-center justify-around px-4 h-16">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 relative
                transition-colors py-2 px-4
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-caramel)] rounded-lg
                ${isActive
                  ? 'text-[var(--color-caramel)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                }`}
              style={{ minWidth: 64, minHeight: 48 }}
              role="tab"
              aria-selected={isActive}
              aria-label={tab.label}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 rounded-full bg-[var(--color-caramel)]
                    text-white text-[10px] font-bold flex items-center justify-center px-1">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[var(--color-caramel)]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ──────────────────────────────────────────────
// App Root
// ──────────────────────────────────────────────

// ──────────────────────────────────────────────
// Password Gate
// ──────────────────────────────────────────────

const PW_HASH = '4271fa8e069bb155d6e82d6a8e9e4a577c2c5b7d0990d985ef1af9aa6db3313c';
const AUTH_KEY = 'grindy-auth';

async function hashPassword(pw) {
  const data = new TextEncoder().encode(pw);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function PasswordGate({ children }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === 'true');
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  if (authed) return children;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const hash = await hashPassword(input);
    if (hash === PW_HASH) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      setAuthed(true);
    } else {
      setError(true);
      setInput('');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-svh flex items-center justify-center px-6" style={{ background: 'var(--color-espresso)' }}>
      <form onSubmit={handleSubmit} className="w-full max-w-[300px] text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--color-roast)] flex items-center justify-center mx-auto mb-6">
          <Coffee size={28} className="text-[var(--color-gold)]" />
        </div>
        <h1 className="text-2xl text-[var(--color-cream)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Grindy
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mb-8">
          Bitte Passwort eingeben
        </p>
        <input
          type="password"
          value={input}
          onChange={e => { setInput(e.target.value); setError(false); }}
          placeholder="Passwort"
          autoFocus
          className={`w-full px-4 py-3 rounded-xl text-sm text-center bg-[var(--color-espresso-light)]
            text-[var(--color-cream)] placeholder:text-[var(--color-text-muted)]
            focus:outline-none focus:ring-2 transition-colors
            ${error ? 'ring-2 ring-[var(--color-error)]' : 'focus:ring-[var(--color-caramel)]'}`}
          style={{ minHeight: 48 }}
        />
        {error && (
          <p className="text-xs text-[var(--color-error)] mt-2">Falsches Passwort</p>
        )}
        <button
          type="submit"
          disabled={!input || loading}
          className="w-full mt-4 py-3 rounded-xl font-semibold text-sm transition-colors
            bg-[var(--color-caramel)] text-white hover:bg-[var(--color-roast-light)]
            disabled:opacity-40 disabled:cursor-not-allowed
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
          style={{ minHeight: 48 }}
        >
          {loading ? 'Prüfe...' : 'Öffnen'}
        </button>
      </form>
    </div>
  );
}

// ──────────────────────────────────────────────
// App Root
// ──────────────────────────────────────────────

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { showToast, hideToast } = useToast(dispatch);

  // Persist collection & firstUse to localStorage on every change
  useEffect(() => {
    persistState(state);
  }, [state.collection, state.firstUse]);

  const renderView = () => {
    if (state.currentView === 'detail') {
      return <BeanDetailView state={state} dispatch={dispatch} showToast={showToast} />;
    }

    switch (state.activeTab) {
      case 'collection':
        return <CollectionView state={state} dispatch={dispatch} showToast={showToast} />;
      case 'discover':
        return <DiscoverView state={state} dispatch={dispatch} showToast={showToast} />;
      case 'add':
        return <AddView state={state} dispatch={dispatch} showToast={showToast} />;
      default:
        return null;
    }
  };

  return (
    <PasswordGate>
      {/* Main content — scrollable */}
      <main className="flex-1 min-h-0 overflow-y-auto overscroll-none">
        {/* First use hint — non-blocking */}
        {state.firstUse && state.collection.length === 0 && (
          <FirstUseHint onDismiss={() => dispatch({ type: 'DISMISS_FIRST_USE' })} />
        )}

        {renderView()}
      </main>

      {/* Bottom Navigation — always at bottom via flex layout */}
      <BottomNav
        activeTab={state.activeTab}
        onNavigate={tab => dispatch({ type: 'NAVIGATE_TAB', tab })}
        collectionCount={state.collection.length}
      />

      {/* Toast — overlay */}
      <Toast
        toast={state.toast}
        onDismiss={hideToast}
        onUndo={() => state.toast?.undoAction?.()}
      />
    </PasswordGate>
  );
}
