import { useReducer, useCallback, useRef, useEffect, useState, useMemo } from 'react';
import {
  Coffee, Search, Plus, ChevronLeft, Star, X, Check,
  MapPin, Mountain, Layers, Droplets, ArrowRight,
  Flame, Filter, CoffeeIcon, SlidersHorizontal, Pen,
  Undo2, AlertCircle, Sparkles, ChevronDown, ChevronUp,
  Timer, Weight, GlassWater, CircleDot, Navigation2, Locate, Compass,
} from 'lucide-react';
import { TapeCoffee, TapeSearch, TapePlus, TapeSettings, CupShowcase, TapeCup1, TapeCup2, TapeCup3, TapeCup4, TapeCup5, RoasteryLogo } from './TapeIcons';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
} from 'recharts';
import {
  COFFEE_DATABASE, FLAVOR_NOTES, INITIAL_VISIBLE_TAGS,
  DRINK_TYPES, GRINDER, ROAST_LEVELS, PROCESSING_METHODS,
  COUNTRY_FLAGS, getRoasteriesGrouped, getRecipeDefaults,
  LOCATIONS, distanceBetween, bearingBetween,
} from './data/coffeeDatabase';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ──────────────────────────────────────────────
// localStorage Persistence
// ──────────────────────────────────────────────

const STORAGE_KEY = 'grindy-data';
const RECIPE_VERSION = 2; // Bump to force recipe recalculation

function migrateRecipes(persisted) {
  if (!persisted || persisted.recipeVersion >= RECIPE_VERSION) return persisted;
  if (!persisted.collection?.length) return persisted ? { ...persisted, recipeVersion: RECIPE_VERSION } : persisted;

  const migrated = persisted.collection.map(item => {
    const bean = item.bean || COFFEE_DATABASE.find(b => b.id === item.beanId);
    if (!bean) return item;
    const defaults = getRecipeDefaults(bean);
    const newRecipes = {};
    DRINK_TYPES.forEach(dt => {
      const d = defaults[dt.id];
      newRecipes[dt.id] = d
        ? { grind: d.grind, dose: d.dose, yield: d.yield, time: d.time }
        : { grind: null, dose: null, yield: null, time: null };
    });
    return { ...item, recipes: newRecipes };
  });

  return { ...persisted, collection: migrated, recipeVersion: RECIPE_VERSION };
}

function loadPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return migrateRecipes(JSON.parse(raw));
  } catch {
    return null;
  }
}

function persistState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      collection: state.collection,
      firstUse: state.firstUse,
      recipeVersion: RECIPE_VERSION,
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
  activeTab: 'collection', // collection | discover | settings
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
      // Smart defaults basierend auf Röstgrad & Processing (Niche Zero + Rocket Appartamento)
      const defaults = getRecipeDefaults(bean);
      const emptyRecipes = {};
      DRINK_TYPES.forEach(dt => {
        const d = defaults[dt.id];
        emptyRecipes[dt.id] = d
          ? { grind: d.grind, dose: d.dose, yield: d.yield, time: d.time }
          : { grind: null, dose: null, yield: null, time: null };
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
        previousTab: state.activeTab,
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

function EmptyCollection({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-[var(--color-cream)] flex items-center justify-center mb-6">
        <TapeCup2 size={36} className="text-[var(--color-caramel)]" />
      </div>
      <h2 className="text-2xl text-[var(--color-text-primary)] mb-2"
        style={{ fontFamily: 'var(--font-display)' }}>
        Deine Sammlung ist leer
      </h2>
      <p className="text-[var(--color-text-muted)] text-sm mb-8 max-w-[260px]">
        Füge deine erste Bohne hinzu — aus der Datenbank oder manuell.
      </p>
      <button
        onClick={onAdd}
        className="py-3 px-8 bg-[var(--color-caramel)] text-white rounded-xl font-semibold text-sm
          hover:bg-[var(--color-roast-light)] transition-colors
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-caramel)] focus-visible:ring-offset-2"
        style={{ minHeight: 48 }}
      >
        Bohne hinzufügen
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────
// Bean Card Component
// ──────────────────────────────────────────────

function BeanCard({ collectionItem, onClick }) {
  const { bean, recipes } = collectionItem;
  const [activeTab, setActiveTab] = useState('double');

  const activeRecipe = activeTab === 'double' ? (recipes?.double || {}) : (recipes?.single || {});
  const roastLevel = ROAST_LEVELS.find(r => r.id === bean.roast) || ROAST_LEVELS[2];
  const rc = roastLevel.color;
  const ratio = activeRecipe.dose && activeRecipe.yield
    ? (activeRecipe.yield / activeRecipe.dose).toFixed(1)
    : null;

  return (
    <div
      className="w-full bg-white rounded-xl overflow-hidden"
      style={{ border: '1px solid #EBEBEB' }}
    >
      {/* Header — navigiert zur Detail-Ansicht */}
      <div
        onClick={onClick}
        className="flex items-center gap-3 px-3.5 py-3 cursor-pointer hover:bg-[#FAFAFA] transition-colors duration-100"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') onClick(); }}
      >
        <RoasteryLogo name={bean.roastery} size={32} className="shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-[var(--color-text-primary)] leading-tight truncate"
            style={{ fontFamily: 'var(--font-display)' }}>
            {bean.name}
          </p>
          <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5 truncate">
            {bean.roastery}
          </p>
        </div>
        <div
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: rc }}
        />
      </div>

      {/* Rezept — eine Zeile */}
      <div className="flex items-center border-t border-[#F2F2F2] px-3.5 py-2">
        {/* Toggle D / S — beide sichtbar, großes Touch-Target */}
        <div className="flex shrink-0 mr-3">
          {['double', 'single'].map(id => (
            <div
              key={id}
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className="flex items-center justify-center cursor-pointer"
              style={{ minHeight: 44, minWidth: 32 }}
            >
              <span
                className="text-[11px] transition-colors duration-100"
                style={{
                  color: activeTab === id ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                  fontWeight: activeTab === id ? 600 : 400,
                }}
              >
                {id === 'double' ? 'D' : 'S'}
              </span>
            </div>
          ))}
        </div>

        {/* Werte inline */}
        <div className="flex-1 flex items-baseline gap-3 text-[11px] tabular-nums overflow-hidden">
          <span className="text-[var(--color-text-primary)] font-medium">{activeRecipe.grind != null ? activeRecipe.grind : '–'}</span>
          <span className="text-[var(--color-text-muted)]">{activeRecipe.dose != null ? `${activeRecipe.dose}g` : '–'} → {activeRecipe.yield != null ? `${activeRecipe.yield}g` : '–'}</span>
          {ratio && <span className="text-[var(--color-text-muted)]">1:{ratio}</span>}
          <span className="text-[var(--color-text-muted)]">{activeRecipe.time != null ? `${activeRecipe.time}s` : '–'}</span>
        </div>
      </div>
    </div>
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
    <div className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
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

      {/* Bohne hinzufügen */}
      <button
        onClick={() => dispatch({ type: 'START_ADD_MANUAL' })}
        className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl
          border border-dashed border-[#D0D0D0] text-[var(--color-text-muted)]
          hover:border-[#AAA] hover:text-[var(--color-text-secondary)] transition-colors
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-caramel)]"
        style={{ minHeight: 48 }}
      >
        <Plus size={16} />
        <span className="text-[12px] font-medium">Bohne hinzufügen</span>
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────
// Discover View (Datenbank)
// ──────────────────────────────────────────────

// ── Leaflet Map Hook ──────────────────────────

function useLeafletMap(containerRef, center, zoom) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center,
      zoom,
      zoomControl: false,
      attributionControl: false,
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);
    mapRef.current = map;

    // Leaflet needs invalidateSize when container becomes visible (tab switch)
    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []); // mount once

  return mapRef;
}

// ── Geolocation Hook ──────────────────────────

function useGeolocation() {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const watchRef = useRef(null);

  const request = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation nicht unterstützt');
      return;
    }
    setLoading(true);
    setError(null);

    // Get initial position fast
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      (err) => {
        setError(err.code === 1 ? 'Standortzugriff verweigert' : 'Standort nicht verfügbar');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );

    // Then watch for updates
    if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    return () => {
      if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
    };
  }, []);

  return { position, error, loading, request };
}

// ── Device Heading Hook (for compass) ─────────

function useDeviceHeading() {
  const [heading, setHeading] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      // iOS: webkitCompassHeading, Android: alpha
      const h = e.webkitCompassHeading ?? (e.alpha != null ? (360 - e.alpha) : null);
      if (h != null) setHeading(h);
    };

    // iOS 13+ requires permission
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(perm => { if (perm === 'granted') window.addEventListener('deviceorientation', handler, true); })
        .catch(() => {});
    } else {
      window.addEventListener('deviceorientation', handler, true);
    }

    return () => window.removeEventListener('deviceorientation', handler, true);
  }, []);

  return heading;
}

// ── Format distance ───────────────────────────

function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

// ── Custom Map Pin (SVG as Leaflet divIcon) ───

function createMapPin(type, isNearest) {
  const color = type === 'roastery' ? '#000' : '#666';
  const size = isNearest ? 36 : 28;
  const html = `<svg width="${size}" height="${size + 8}" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 34C14 34 26 20.5 26 13C26 6.4 20.6 1 14 1C7.4 1 2 6.4 2 13C2 20.5 14 34 14 34Z" fill="${color}" stroke="white" stroke-width="2"/>
    <circle cx="14" cy="13" r="5" fill="white"/>
  </svg>`;
  return L.divIcon({
    html,
    className: '',
    iconSize: [size, size + 8],
    iconAnchor: [size / 2, size + 8],
  });
}

// ── Compass Card ──────────────────────────────

function CompassCard({ target, userPos, heading, onClose }) {
  const dist = distanceBetween(userPos.lat, userPos.lng, target.lat, target.lng);
  const bearing = bearingBetween(userPos.lat, userPos.lng, target.lat, target.lng);
  // Rotation: bearing relative to device heading (or north if no heading)
  const rotation = heading != null ? bearing - heading : bearing;

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000,
      background: 'rgba(255,255,255,0.97)', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-cream)]"
        style={{ minWidth: 44, minHeight: 44 }}
      >
        <X size={20} />
      </button>

      <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest mb-2">
        Nächste {target.type === 'roastery' ? 'Rösterei' : 'Café'}
      </p>
      <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>
        {target.name}
      </h2>
      <p className="text-sm text-[var(--color-text-secondary)] mb-8">{target.address}</p>

      {/* Compass ring */}
      <div style={{
        width: 200, height: 200, borderRadius: '50%',
        border: '3px solid #E5E5E5', position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24,
      }}>
        {/* N/S/E/W labels */}
        <span className="absolute text-[10px] font-bold text-[var(--color-text-muted)]" style={{ top: 8 }}>N</span>
        <span className="absolute text-[10px] font-bold text-[var(--color-text-muted)]" style={{ bottom: 8 }}>S</span>
        <span className="absolute text-[10px] font-bold text-[var(--color-text-muted)]" style={{ right: 8 }}>E</span>
        <span className="absolute text-[10px] font-bold text-[var(--color-text-muted)]" style={{ left: 8 }}>W</span>

        {/* Direction arrow */}
        <div style={{
          transform: `rotate(${rotation}deg)`,
          transition: 'transform 0.3s ease-out',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <Navigation2 size={48} strokeWidth={2.5} style={{ marginBottom: -4 }} />
        </div>
      </div>

      <p className="text-4xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>
        {formatDistance(dist)}
      </p>
      <p className="text-sm text-[var(--color-text-muted)]">
        {heading == null ? 'Kompass nicht verfügbar — Richtung ab Norden' : 'Drehe dein Gerät in Pfeilrichtung'}
      </p>
    </div>
  );
}

// ── DiscoverView — Map-based Discovery ────────

function DiscoverView({ state, dispatch, showToast }) {
  const mapContainerRef = useRef(null);
  const mapRef = useLeafletMap(mapContainerRef, [51.2250, 6.7850], 13);
  const geo = useGeolocation();
  const heading = useDeviceHeading();
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);
  const [compassTarget, setCompassTarget] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showList, setShowList] = useState(false);

  // Sort locations by distance when position is available
  const sortedLocations = useMemo(() => {
    if (!geo.position) return LOCATIONS;
    return [...LOCATIONS]
      .map(loc => ({ ...loc, distance: distanceBetween(geo.position.lat, geo.position.lng, loc.lat, loc.lng) }))
      .sort((a, b) => a.distance - b.distance);
  }, [geo.position]);

  const nearest = sortedLocations[0];

  // Add location markers to map
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    LOCATIONS.forEach(loc => {
      const isNearest = geo.position && nearest && loc.name === nearest.name;
      const marker = L.marker([loc.lat, loc.lng], {
        icon: createMapPin(loc.type, isNearest),
      }).addTo(map);

      marker.on('click', () => setSelectedLocation(loc));

      // Tooltip with name
      marker.bindTooltip(loc.name, {
        direction: 'top',
        offset: [0, -30],
        className: 'leaflet-tooltip-custom',
      });

      markersRef.current.push(marker);
    });
  }, [mapRef.current, nearest?.name]);

  // Update user position marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !geo.position) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([geo.position.lat, geo.position.lng]);
    } else {
      const pulseHtml = `<div style="
        width: 16px; height: 16px; background: #4A90D9; border: 3px solid white;
        border-radius: 50%; box-shadow: 0 0 0 4px rgba(74,144,217,0.3);
      "></div>`;
      userMarkerRef.current = L.marker([geo.position.lat, geo.position.lng], {
        icon: L.divIcon({ html: pulseHtml, className: '', iconSize: [22, 22], iconAnchor: [11, 11] }),
        zIndexOffset: 1000,
      }).addTo(map);

      // Pan to user
      map.setView([geo.position.lat, geo.position.lng], 14, { animate: true });
    }
  }, [geo.position]);

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Map */}
      <div ref={mapContainerRef} style={{ flex: 1, minHeight: 0 }} />

      {/* Top bar — overlaid on map */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 500,
        padding: '12px 16px', display: 'flex', gap: 8,
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(255,255,255,0))',
        paddingBottom: 32,
      }}>
        <h1 className="text-lg font-bold flex-1" style={{ fontFamily: 'var(--font-display)' }}>
          Entdecken
        </h1>
      </div>

      {/* Map controls — right side */}
      <div style={{
        position: 'absolute', top: 56, right: 12, zIndex: 500,
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {/* Locate me */}
        <button
          onClick={() => {
            if (geo.position && mapRef.current) {
              mapRef.current.setView([geo.position.lat, geo.position.lng], 15, { animate: true });
            } else {
              geo.request();
            }
          }}
          className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center"
          style={{ minWidth: 44, minHeight: 44 }}
          aria-label="Mein Standort"
        >
          <Locate size={20} className={geo.position ? 'text-[#4A90D9]' : 'text-[var(--color-text-muted)]'} />
        </button>
      </div>

      {/* Bottom sheet — location list + compass shortcut */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 500,
        background: 'white', borderRadius: '16px 16px 0 0',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.1)',
        maxHeight: showList ? '60%' : 'auto',
        transition: 'max-height 0.3s ease',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Handle + toggle */}
        <button
          onClick={() => setShowList(!showList)}
          className="w-full flex flex-col items-center pt-2 pb-3 px-4"
          style={{ minHeight: 44 }}
        >
          <div style={{ width: 36, height: 4, borderRadius: 2, background: '#DDD', marginBottom: 8 }} />
          {!geo.position ? (
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-[var(--color-text-muted)]" />
              <span className="text-sm text-[var(--color-text-secondary)]">
                {LOCATIONS.filter(l => l.city === 'Düsseldorf').length} Orte in Düsseldorf
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span className="text-sm font-medium">
                {sortedLocations.length} Orte in der Nähe
              </span>
              {nearest?.distance != null && (
                <span className="text-xs text-[var(--color-text-muted)]">
                  · Nächste: {formatDistance(nearest.distance)}
                </span>
              )}
            </div>
          )}
        </button>

        {/* Compass shortcut — only when position is known */}
        {geo.position && nearest && (
          <button
            onClick={() => setCompassTarget(nearest)}
            className="mx-4 mb-3 flex items-center gap-3 px-4 py-3 rounded-xl bg-black text-white"
            style={{ minHeight: 48 }}
          >
            <Compass size={20} />
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold">Zur nächsten Rösterei</p>
              <p className="text-xs opacity-70">{nearest.name} · {formatDistance(nearest.distance)}</p>
            </div>
            <ArrowRight size={16} className="opacity-50" />
          </button>
        )}

        {/* Locate button — when no position yet */}
        {!geo.position && (
          <button
            onClick={geo.request}
            disabled={geo.loading}
            className="mx-4 mb-3 flex items-center gap-3 px-4 py-3 rounded-xl bg-black text-white"
            style={{ minHeight: 48 }}
          >
            <Locate size={20} />
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold">
                {geo.loading ? 'Suche Standort...' : 'Standort teilen'}
              </p>
              <p className="text-xs opacity-70">Finde Röstereien in deiner Nähe</p>
            </div>
          </button>
        )}

        {geo.error && (
          <p className="text-xs text-[var(--color-error)] px-4 pb-2">{geo.error}</p>
        )}

        {/* Scrollable location list */}
        {showList && (
          <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 8 }}>
            {sortedLocations.map((loc) => (
              <button
                key={loc.name + loc.address}
                onClick={() => {
                  setSelectedLocation(loc);
                  setShowList(false);
                  if (mapRef.current) mapRef.current.setView([loc.lat, loc.lng], 16, { animate: true });
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--color-cream)] transition-colors"
                style={{ minHeight: 48 }}
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--color-cream)] flex items-center justify-center shrink-0">
                  {loc.type === 'roastery' ? (
                    <Coffee size={16} />
                  ) : (
                    <MapPin size={16} className="text-[var(--color-text-secondary)]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{loc.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)] truncate">{loc.address}</p>
                </div>
                {loc.distance != null && (
                  <span className="text-xs text-[var(--color-text-muted)] shrink-0">
                    {formatDistance(loc.distance)}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected location popup */}
      {selectedLocation && (
        <div style={{
          position: 'absolute', bottom: geo.position ? 180 : 150, left: 16, right: 16, zIndex: 600,
          background: 'white', borderRadius: 16, padding: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        }}>
          <button
            onClick={() => setSelectedLocation(null)}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--color-cream)]"
            style={{ minWidth: 44, minHeight: 44 }}
          >
            <X size={16} />
          </button>
          <div className="flex items-start gap-3">
            <RoasteryLogo name={selectedLocation.name} size={44} className="shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold leading-tight">{selectedLocation.name}</h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{selectedLocation.address}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-cream)]">
                  {selectedLocation.type === 'roastery' ? 'Rösterei' : 'Café'}
                </span>
                {selectedLocation.sellsBeans && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-cream)]">
                    Bohnen kaufen
                  </span>
                )}
                {selectedLocation.distance != null && (
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {formatDistance(selectedLocation.distance)}
                  </span>
                )}
              </div>
            </div>
          </div>
          {geo.position && (
            <button
              onClick={() => { setCompassTarget(selectedLocation); setSelectedLocation(null); }}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-black text-white text-sm font-medium"
              style={{ minHeight: 44 }}
            >
              <Compass size={16} />
              Wegweiser starten
            </button>
          )}
        </div>
      )}

      {/* Compass overlay */}
      {compassTarget && geo.position && (
        <CompassCard
          target={compassTarget}
          userPos={geo.position}
          heading={heading}
          onClose={() => setCompassTarget(null)}
        />
      )}
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
        <div className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
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
            <div className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
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
// Add Bean Flow — Search-to-Create
// ──────────────────────────────────────────────

function AddBeanFlow({ state, dispatch, showToast }) {
  const { addStep, addDraft, collection } = state;
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  // Autocomplete: search roasteries + beans
  const suggestions = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    const q = query.toLowerCase();
    return COFFEE_DATABASE.filter(b =>
      b.roastery.toLowerCase().includes(q) ||
      b.name.toLowerCase().includes(q) ||
      b.origin.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  const alreadyInCollection = useCallback((beanId) =>
    collection.some(c => c.beanId === beanId),
  [collection]);

  // Step 0: Search/Select, Step 1: Details (manual only), Step 2: Roast/Processing (manual only)
  const isManual = addStep > 0;

  // Focus input on mount
  useEffect(() => {
    if (addStep === 0 && inputRef.current) inputRef.current.focus();
  }, [addStep]);

  const handleSelectBean = (bean) => {
    if (alreadyInCollection(bean.id)) return;
    dispatch({ type: 'ADD_TO_COLLECTION', beanId: bean.id });
    showToast(`${bean.name} hinzugefügt`);
    dispatch({ type: 'BACK_TO_LIST' });
  };

  const handleStartManual = () => {
    // Prefill roastery from current query if it looks like one
    dispatch({ type: 'UPDATE_ADD_DRAFT', updates: { roastery: query } });
    dispatch({ type: 'SET_ADD_STEP', step: 1 });
  };

  if (!addDraft) return null;

  return (
    <div className="px-4 pt-4 pb-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => {
            if (addStep > 1) {
              dispatch({ type: 'SET_ADD_STEP', step: addStep - 1 });
            } else {
              dispatch({ type: 'BACK_TO_LIST' });
            }
          }}
          className="w-10 h-10 rounded-full bg-[var(--color-cream)] flex items-center justify-center
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-caramel)]"
          style={{ minWidth: 44, minHeight: 44 }}
          aria-label="Zurück"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
          {addStep === 0 ? 'Bohne hinzufügen' : addStep === 1 ? 'Details' : 'Röstung'}
        </h2>
      </div>

      {/* Step 0: Search + suggestions */}
      {addStep === 0 && (
        <>
          <div className="relative mb-2">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Rösterei, Bohne oder Herkunft..."
              className="w-full pl-10 pr-4 py-3 bg-[var(--color-cream)] rounded-xl text-sm
                placeholder:text-[var(--color-text-muted)]
                focus:outline-none focus:ring-2 focus:ring-[var(--color-caramel)] focus:bg-white transition-colors"
              style={{ minHeight: 48 }}
            />
          </div>

          {/* Suggestions from database */}
          {suggestions.length > 0 && (
            <div className="space-y-1 mb-4">
              {suggestions.map(bean => {
                const inCol = alreadyInCollection(bean.id);
                return (
                  <button
                    key={bean.id}
                    onClick={() => handleSelectBean(bean)}
                    disabled={inCol}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-colors
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-caramel)]
                      ${inCol ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[var(--color-cream)]'}`}
                  >
                    <RoasteryLogo name={bean.roastery} size={28} className="shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-[var(--color-text-primary)] truncate">
                        {bean.name}
                      </p>
                      <p className="text-[10px] text-[var(--color-text-muted)] truncate">
                        {bean.roastery} · {bean.origin}
                      </p>
                    </div>
                    {inCol
                      ? <Check size={14} className="text-[var(--color-text-muted)] shrink-0" />
                      : <Plus size={14} className="text-[var(--color-text-muted)] shrink-0" />
                    }
                  </button>
                );
              })}
            </div>
          )}

          {/* Manual creation option */}
          {query.trim().length >= 2 && (
            <button
              onClick={handleStartManual}
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left
                border border-dashed border-[#D0D0D0] text-[var(--color-text-muted)]
                hover:border-[#AAA] hover:text-[var(--color-text-secondary)] transition-colors
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-caramel)]"
              style={{ minHeight: 48 }}
            >
              <Pen size={14} className="shrink-0" />
              <span className="text-[12px] font-medium">
                „{query}" manuell anlegen
              </span>
            </button>
          )}

          {query.trim().length < 2 && (
            <p className="text-[11px] text-[var(--color-text-muted)] text-center mt-6">
              Tippe los um Bohnen zu finden oder eine neue anzulegen
            </p>
          )}
        </>
      )}

      {/* Step 1: Manual details */}
      {addStep === 1 && (
        <div className="space-y-5">
          <FormField
            label="Rösterei"
            value={addDraft.roastery}
            onChange={v => dispatch({ type: 'UPDATE_ADD_DRAFT', updates: { roastery: v } })}
            placeholder="z.B. The Barn"
            required
          />
          <FormField
            label="Bohnen-Name"
            value={addDraft.name}
            onChange={v => dispatch({ type: 'UPDATE_ADD_DRAFT', updates: { name: v } })}
            placeholder="z.B. Nano Challa"
            required
          />
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
          <div className="mt-6">
            <button
              onClick={() => dispatch({ type: 'SET_ADD_STEP', step: 2 })}
              disabled={!addDraft.roastery.trim() || !addDraft.name.trim()}
              className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-caramel)]
                ${addDraft.roastery.trim() && addDraft.name.trim()
                  ? 'bg-[var(--color-caramel)] text-white hover:bg-[var(--color-roast-light)]'
                  : 'bg-[var(--color-cream-dark)] text-[var(--color-text-muted)] cursor-not-allowed'
                }`}
              style={{ minHeight: 48 }}
            >
              Weiter
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Roast + Processing */}
      {addStep === 2 && (
        <div className="space-y-5">
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
                  <div className="w-5 h-5 rounded-full mx-auto mb-1" style={{ backgroundColor: level.color }} />
                  {level.label}
                </button>
              ))}
            </div>
          </div>

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

          <div className="mt-6">
            <button
              onClick={() => {
                dispatch({ type: 'SAVE_CUSTOM_BEAN' });
                showToast('Bohne zur Sammlung hinzugefügt!');
              }}
              className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all
                bg-[var(--color-caramel)] text-white hover:bg-[var(--color-roast-light)]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-caramel)]"
              style={{ minHeight: 48 }}
            >
              Bohne speichern
            </button>
          </div>
        </div>
      )}
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
// Settings View
// ──────────────────────────────────────────────

function SettingsView({ state, dispatch, showToast }) {
  // For now, equipment is read from the constants — later this could be persisted
  const [grinder, setGrinder] = useState(GRINDER.name);
  const [machine, setMachine] = useState('Rocket Appartamento');

  return (
    <div className="px-4 pt-4 pb-4">
      <h1 className="text-2xl font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
        Einstellungen
      </h1>
      <p className="text-sm text-[var(--color-text-muted)] mt-0.5 mb-6">
        Equipment & Präferenzen
      </p>

      <div className="space-y-4">
        {/* Mühle */}
        <div className="bg-white rounded-xl p-4" style={{ border: '1px solid #EBEBEB' }}>
          <label className="block text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">
            Mühle
          </label>
          <select
            value={grinder}
            onChange={e => setGrinder(e.target.value)}
            className="w-full text-[14px] font-medium text-[var(--color-text-primary)] bg-transparent
              border-none outline-none cursor-pointer appearance-none"
          >
            <option>Niche Zero</option>
            <option>Eureka Mignon Specialità</option>
            <option>Baratza Sette 270</option>
            <option>Comandante C40</option>
            <option>DF64</option>
            <option>Lagom P64</option>
            <option>Fellow Ode</option>
          </select>
        </div>

        {/* Maschine */}
        <div className="bg-white rounded-xl p-4" style={{ border: '1px solid #EBEBEB' }}>
          <label className="block text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">
            Espressomaschine
          </label>
          <select
            value={machine}
            onChange={e => setMachine(e.target.value)}
            className="w-full text-[14px] font-medium text-[var(--color-text-primary)] bg-transparent
              border-none outline-none cursor-pointer appearance-none"
          >
            <option>Rocket Appartamento</option>
            <option>ECM Classika</option>
            <option>Lelit Bianca</option>
            <option>Bezzera BZ10</option>
            <option>Profitec Pro 300</option>
            <option>La Marzocco Linea Mini</option>
            <option>Sage Barista Express</option>
            <option>Rancilio Silvia</option>
          </select>
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
    { id: 'collection', label: 'Sammlung', icon: TapeCup2, badge: collectionCount },
    { id: 'discover', label: 'Entdecken', icon: TapeSearch },
    { id: 'settings', label: 'Einstellungen', icon: TapeSettings },
  ];

  return (
    <nav
      className="shrink-0 bg-white/95 backdrop-blur-md border-t border-[var(--color-cream-dark)]
        safe-area-bottom"
      role="tablist"
      aria-label="Hauptnavigation"
    >
      <div className="flex items-center justify-around px-4 h-14 pt-2">
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
                  ? 'text-black'
                  : 'text-black/40 hover:text-black/60'
                }`}
              style={{ minWidth: 64, minHeight: 48 }}
              role="tab"
              aria-selected={isActive}
              aria-label={tab.label}
            >
              <div className="relative">
                <Icon size={26} strokeWidth={isActive ? 2.5 : 2} />
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
  const [showCupPicker, setShowCupPicker] = useState(false);

  // Persist collection & firstUse to localStorage on every change
  useEffect(() => {
    persistState(state);
  }, [state.collection, state.firstUse]);

  const renderView = () => {
    if (state.currentView === 'detail') {
      return <BeanDetailView state={state} dispatch={dispatch} showToast={showToast} />;
    }
    if (state.currentView === 'addManual') {
      return <AddBeanFlow state={state} dispatch={dispatch} showToast={showToast} />;
    }

    switch (state.activeTab) {
      case 'collection':
        return <CollectionView state={state} dispatch={dispatch} showToast={showToast} />;
      case 'discover':
        return <DiscoverView state={state} dispatch={dispatch} showToast={showToast} />;
      case 'settings':
        return <SettingsView state={state} dispatch={dispatch} showToast={showToast} />;
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

      {/* Temporary: Cup style picker */}
      {showCupPicker && (
        <CupShowcase
          onSelect={(id) => { console.log('Selected cup:', id); setShowCupPicker(false); }}
          onClose={() => setShowCupPicker(false)}
        />
      )}
    </PasswordGate>
  );
}
