export type ModifierOption = {
  id: string
  label: string
  /** Added to the base item price when this option is selected. Defaults to 0. */
  priceChange?: number
  /** If true, this option is pre-selected when the customizer first opens. */
  default?: boolean
}

export type ModifierGroup = {
  id: string
  label: string
  /**
   * single = exactly one option (radio); multi = any number (checkboxes).
   * For single groups, the default option is always selected (or the first one).
   */
  type: 'single' | 'multi'
  /** Optional helper sentence printed under the group label. */
  helper?: string
  options: ModifierOption[]
}

export type MenuItem = {
  id: string
  name: string
  description?: string
  price: number
  category: CategoryId
  /** Optional flair: a one-line "story" tag printed in italics on the card */
  flair?: string
  /** Mark out-of-stock items so we can render them differently */
  outOfStock?: boolean
  /** When present, clicking "Add" opens the customizer modal instead of
   *  adding immediately. Items without modifiers add directly. */
  modifiers?: ModifierGroup[]
}

/* ---------------------------------------------------------- */
/* SHARED MODIFIER PRESETS                                    */
/* ---------------------------------------------------------- */
/** Bagel choice: applies to most sandwiches that can be built on any bagel. */
const BAGEL_CHOICE: ModifierGroup = {
  id: 'bagel',
  label: 'Bagel',
  type: 'single',
  helper: 'Swap the default bagel for any of our daily-baked options.',
  options: [
    { id: 'plain', label: 'Plain', default: true },
    { id: 'everything', label: 'Everything' },
    { id: 'asiago', label: 'Asiago', priceChange: 0.50 },
    { id: 'jalapeno-cheddar', label: 'Jalapeño Cheddar', priceChange: 0.50 },
    { id: 'cinnamon-raisin', label: 'Cinnamon Raisin' },
    { id: 'french-toast', label: 'French Toast' },
    { id: 'gf-plain', label: 'GF Plain', priceChange: 1.50 },
  ],
}

/** Cheese: single-select for sandwiches with one cheese. */
const CHEESE_SINGLE: ModifierGroup = {
  id: 'cheese',
  label: 'Cheese',
  type: 'single',
  options: [
    { id: 'american', label: 'American', default: true },
    { id: 'cheddar', label: 'Cheddar' },
    { id: 'pepper-jack', label: 'Pepper Jack' },
    { id: 'provolone', label: 'Provolone' },
    { id: 'no-cheese', label: 'No Cheese' },
  ],
}

/** Cream cheese: single-select for plain bagel orders. */
const CREAM_CHEESE: ModifierGroup = {
  id: 'cream-cheese',
  label: 'Cream Cheese',
  type: 'single',
  options: [
    { id: 'plain-cc', label: 'Plain', default: true },
    { id: 'chive-onion', label: 'Chive & Onion' },
    { id: 'veggie', label: 'Veggie' },
    { id: 'no-cc', label: 'No Cream Cheese' },
  ],
}

/** Sandwich add-ons: free or paid extras (multi-select). */
const SANDWICH_ADDONS: ModifierGroup = {
  id: 'addons',
  label: 'Add-ons',
  type: 'multi',
  helper: 'Pile it on — small fee for the good stuff.',
  options: [
    { id: 'avocado', label: 'Avocado', priceChange: 2.00 },
    { id: 'extra-cheese', label: 'Extra Cheese', priceChange: 1.50 },
    { id: 'turkey-bacon', label: 'Turkey Bacon', priceChange: 3.00 },
    { id: 'beef-bacon', label: 'Wood Farms Beef Bacon', priceChange: 3.50 },
    { id: 'extra-dds', label: 'Extra Davey’s Sauce', priceChange: 0.75 },
    { id: 'tomato', label: 'Tomato', priceChange: 0.50 },
    { id: 'jalapenos-add', label: 'Jalapeños' },
    { id: 'red-onion', label: 'Red Onion' },
    { id: 'banana-peppers', label: 'Banana Peppers' },
  ],
}

/** Hold these — multi-select, no price change. */
const HOLD_ITEMS: ModifierGroup = {
  id: 'hold',
  label: 'Hold the…',
  type: 'multi',
  options: [
    { id: 'no-egg', label: 'No Egg' },
    { id: 'no-sauce', label: 'No Davey’s Sauce' },
    { id: 'no-banana-peppers', label: 'No Banana Peppers' },
    { id: 'no-jalapenos', label: 'No Jalapeños' },
    { id: 'no-onion', label: 'No Red Onion' },
  ],
}

/** Coffee customization: milk type. */
const MILK_CHOICE: ModifierGroup = {
  id: 'milk',
  label: 'Milk',
  type: 'single',
  options: [
    { id: 'whole', label: 'Whole', default: true },
    { id: 'two-percent', label: '2%' },
    { id: 'skim', label: 'Skim' },
    { id: 'oat', label: 'Oat', priceChange: 1.00 },
    { id: 'almond', label: 'Almond', priceChange: 1.00 },
    { id: 'soy', label: 'Soy', priceChange: 1.00 },
  ],
}

/** Espresso shots — the upsell hit on most coffee drinks. */
const EXTRA_SHOTS: ModifierGroup = {
  id: 'extra-shots',
  label: 'Extra Espresso',
  type: 'single',
  helper: 'Bigger jolt? More art? Add a shot.',
  options: [
    { id: 'none', label: 'No extra shots', default: true },
    { id: 'one', label: '+1 Shot', priceChange: 1.00 },
    { id: 'two', label: '+2 Shots', priceChange: 1.75 },
    { id: 'three', label: '+3 Shots', priceChange: 2.50 },
  ],
}

/** Flavor syrup — multi-select, $0.75 a pump. */
const FLAVOR_SYRUP: ModifierGroup = {
  id: 'syrup',
  label: 'Flavor Syrup',
  type: 'multi',
  helper: 'A pump of personality.',
  options: [
    { id: 'vanilla', label: 'Vanilla', priceChange: 0.75 },
    { id: 'caramel', label: 'Caramel', priceChange: 0.75 },
    { id: 'hazelnut', label: 'Hazelnut', priceChange: 0.75 },
    { id: 'mocha', label: 'Mocha', priceChange: 0.75 },
    { id: 'sf-vanilla', label: 'Sugar-Free Vanilla', priceChange: 0.75 },
    { id: 'lavender', label: 'Lavender', priceChange: 0.75 },
    { id: 'cinnamon', label: 'Cinnamon', priceChange: 0.75 },
  ],
}

/** Sweetener — multi-select, free. */
const SWEETENER: ModifierGroup = {
  id: 'sweetener',
  label: 'Sweetener',
  type: 'multi',
  options: [
    { id: 'sugar', label: 'Sugar' },
    { id: 'raw-sugar', label: 'Raw Sugar' },
    { id: 'honey', label: 'Honey' },
    { id: 'splenda', label: 'Splenda' },
    { id: 'stevia', label: 'Stevia' },
  ],
}

/** Hot or iced — single-select. */
const HOT_OR_ICED: ModifierGroup = {
  id: 'temperature',
  label: 'Temperature',
  type: 'single',
  options: [
    { id: 'hot', label: 'Hot', default: true },
    { id: 'iced', label: 'Iced' },
  ],
}

/** Tea flavor — for bagged tea + tea latte. Bigelow lineup. */
const TEA_FLAVOR: ModifierGroup = {
  id: 'tea-flavor',
  label: 'Tea',
  type: 'single',
  options: [
    { id: 'english-breakfast', label: 'English Breakfast', default: true },
    { id: 'earl-grey', label: 'Earl Grey' },
    { id: 'green', label: 'Green Tea' },
    { id: 'chamomile', label: 'Chamomile' },
    { id: 'peppermint', label: 'Peppermint' },
    { id: 'lemon-ginger', label: 'Lemon Ginger' },
    { id: 'cinnamon-stick', label: 'Cinnamon Stick' },
  ],
}

/** Lemonade flavor. */
const LEMONADE_FLAVOR: ModifierGroup = {
  id: 'lemonade-flavor',
  label: 'Flavor',
  type: 'single',
  options: [
    { id: 'original', label: 'Original Lemon', default: true },
    { id: 'strawberry', label: 'Strawberry' },
    { id: 'raspberry', label: 'Raspberry' },
    { id: 'peach', label: 'Peach' },
    { id: 'lavender', label: 'Lavender' },
  ],
}

/** Apparel size — single-select, XXL gets a $3 surcharge (industry standard). */
const APPAREL_SIZE: ModifierGroup = {
  id: 'size',
  label: 'Size',
  type: 'single',
  options: [
    { id: 's', label: 'S' },
    { id: 'm', label: 'M', default: true },
    { id: 'l', label: 'L' },
    { id: 'xl', label: 'XL' },
    { id: 'xxl', label: 'XXL', priceChange: 3.00 },
    { id: 'xxxl', label: 'XXXL', priceChange: 5.00 },
  ],
}

/** Hat color — single-select. */
const HAT_COLOR: ModifierGroup = {
  id: 'color',
  label: 'Color',
  type: 'single',
  options: [
    { id: 'black', label: 'Black', default: true },
    { id: 'navy', label: 'Navy' },
    { id: 'red', label: 'Paprika Red' },
    { id: 'cream', label: 'Cream' },
  ],
}

/** Standard coffee mod set: milk + shots + syrup + sweetener + temp. */
const COFFEE_FULL_MODS: ModifierGroup[] = [
  HOT_OR_ICED,
  MILK_CHOICE,
  EXTRA_SHOTS,
  FLAVOR_SYRUP,
  SWEETENER,
]

/** Black coffee (espresso, americano, drip): no milk-priority, but still
 *  flavorable + sweetenable + hot/iced. Milk is optional (default whole). */
const COFFEE_BLACK_MODS: ModifierGroup[] = [
  HOT_OR_ICED,
  EXTRA_SHOTS,
  FLAVOR_SYRUP,
  SWEETENER,
  // Milk last — it's optional, default whole stays even if customer ignores
  MILK_CHOICE,
]

/** Clone a modifier group with a different option marked as the default. */
function withDefault(group: ModifierGroup, defaultOptionId: string): ModifierGroup {
  return {
    ...group,
    options: group.options.map((o) => ({ ...o, default: o.id === defaultOptionId })),
  }
}

/** Default modifier set for a typical breakfast sandwich. */
const SANDWICH_MODS: ModifierGroup[] = [BAGEL_CHOICE, CHEESE_SINGLE, SANDWICH_ADDONS, HOLD_ITEMS]

/** Sandwich mods, but with a specific bagel pre-selected. */
const sandwichModsWithBagel = (bagelId: string): ModifierGroup[] => [
  withDefault(BAGEL_CHOICE, bagelId),
  CHEESE_SINGLE,
  SANDWICH_ADDONS,
  HOLD_ITEMS,
]

/** Lox/lunch sandwich mods (cream cheese instead of cheese). */
const loxMods = (bagelId: string = 'everything'): ModifierGroup[] => [
  withDefault(BAGEL_CHOICE, bagelId),
  CREAM_CHEESE,
  SANDWICH_ADDONS,
  HOLD_ITEMS,
]

/** Plain bagel order (build-your-own). */
const plainBagelMods = (bagelId: string): ModifierGroup[] => [
  withDefault(BAGEL_CHOICE, bagelId),
  CREAM_CHEESE,
  {
    id: 'prep',
    label: 'Prep',
    type: 'single',
    options: [
      { id: 'steamed', label: 'Steamed', default: true },
      { id: 'toasted', label: 'Toasted' },
    ],
  },
]

/** Tea mods (bagged tea has flavor + temp + sweetener; tea latte adds milk + syrup). */
const TEA_BAGGED_MODS: ModifierGroup[] = [TEA_FLAVOR, HOT_OR_ICED, SWEETENER]
const TEA_LATTE_MODS: ModifierGroup[] = [TEA_FLAVOR, HOT_OR_ICED, MILK_CHOICE, FLAVOR_SYRUP, SWEETENER]

/** Sweet bagel mods — bagel swap + prep. */
const SWEET_BAGEL_MODS: ModifierGroup[] = [
  withDefault(BAGEL_CHOICE, 'cinnamon-raisin'),
  {
    id: 'prep',
    label: 'Prep',
    type: 'single',
    options: [
      { id: 'toasted', label: 'Toasted', default: true },
      { id: 'steamed', label: 'Steamed' },
    ],
  },
]

export type CategoryId =
  | 'breakfast'
  | 'lunch-lox'
  | 'sweet'
  | 'bagels'
  | 'coffee'
  | 'tea'
  | 'soups'
  | 'drinks'
  | 'sides'
  | 'bulk'
  | 'swag'

export type Category = {
  id: CategoryId
  label: string
  /** Short editorial blurb printed under the section heading */
  blurb: string
}

export const CATEGORIES: Category[] = [
  { id: 'breakfast', label: 'Breakfast Sandwiches', blurb: 'Steamed bagels, griddled eggs, and the kind of mornings worth getting out of bed for.' },
  { id: 'lunch-lox', label: 'Lunch & Lox', blurb: 'Past 11 a.m.? Same legendary bagels — now with smoked salmon, lobster, and the works.' },
  { id: 'sweet',     label: 'Sweet Bagels',         blurb: 'For when breakfast wants to be dessert.' },
  { id: 'bagels',    label: 'Bagels + Cream Cheese', blurb: 'A bagel, a schmear, no fuss. Choose your fighter.' },
  { id: 'coffee',    label: 'Coffee Shop',           blurb: 'Union Blend, espresso, and the rituals that make Fort Wayne tick.' },
  { id: 'tea',       label: 'Tea & Tea Lattes',      blurb: 'Hot or iced, leafy or latte’d.' },
  { id: 'soups',     label: 'Soups',                 blurb: 'Seasonal & made with love.' },
  { id: 'drinks',    label: 'Drinks',                blurb: 'Pop, juice, sparkling, still.' },
  { id: 'sides',     label: 'Sides & Sweets',        blurb: 'Brined spears, parfaits, pastries — the supporting cast that steals the show.' },
  { id: 'bulk',      label: 'Bagels by the Half-Dozen',  blurb: 'Take the whole crew home. They’ll thank you for it.' },
  { id: 'swag',      label: 'Swag',                  blurb: 'Wear the bagel. Mug the bagel. Be the bagel.' },
]

export const MENU: MenuItem[] = [
  // BREAKFAST SANDWICHES
  { id: 'sausage-egg-cheese', category: 'breakfast', name: 'Sausage, Egg & Cheese', price: 9.50,
    description: 'Steamed plain bagel, griddled egg, ¼ lb. Wood Farms sausage patty, American cheese.',
    flair: 'The original. The reason we get out of bed.',
    modifiers: sandwichModsWithBagel('plain') },
  { id: 'thicc-beef-bacon', category: 'breakfast', name: 'Thicc Cut Beef Bacon, Egg & Cheese', price: 11.50,
    description: 'Steamed plain bagel, griddled egg, 4 oz. of thicc-cut Wood Farms beef bacon, American cheese.',
    flair: 'Yes, three c’s. Yes, it’s necessary.',
    modifiers: sandwichModsWithBagel('plain') },
  { id: 'the-07', category: 'breakfast', name: 'The 07 (oh-seven)', price: 10.50,
    description: 'Steamed everything bagel, 3 thick slices of turkey bacon, griddled egg, American cheese, avocado.',
    flair: 'Numbered, beloved, never duplicated.',
    modifiers: sandwichModsWithBagel('everything') },
  { id: 'el-guapo', category: 'breakfast', name: 'El Guapo', price: 11.50,
    description: 'Steamed asiago bagel, turkey bacon, ⅛ lb. pork sausage, griddled egg, American cheese, Davey’s Delicious Sauce.',
    flair: 'Handsome. Powerful. A little dangerous.',
    modifiers: sandwichModsWithBagel('asiago') },
  { id: 'the-mad-ant', category: 'breakfast', name: 'The Mad Ant', price: 11.00,
    description: 'Sausage patty, griddled egg, pepper jack, jalapeños, Davey’s Delicious Sauce.',
    flair: 'For the Coliseum faithful.',
    modifiers: SANDWICH_MODS },
  { id: 'beef-bacon-bandit', category: 'breakfast', name: 'Beef Bacon Bandit', price: 13.50,
    description: 'Steamed asiago bagel, 3 oz. Wood Farms beef bacon, griddled egg, cheddar, red onion, banana peppers, avocado.',
    flair: 'Steals the show. Returns it slightly improved.',
    modifiers: sandwichModsWithBagel('asiago') },
  { id: 'turkey-bacon-egg-cheese', category: 'breakfast', name: 'Turkey Bacon, Egg & Cheese', price: 9.00,
    description: 'Steamed plain bagel, ¼ lb. thicc-cut turkey bacon, griddled egg, American cheese.',
    modifiers: sandwichModsWithBagel('plain') },
  { id: 'pork-bacon-egg-cheese', category: 'breakfast', name: 'Pork Bacon, Egg & Cheese', price: 9.00,
    description: 'A timeless Tuesday morning.',
    modifiers: sandwichModsWithBagel('plain') },
  { id: 'sunrise-special', category: 'breakfast', name: 'Sunrise Special', price: 6.25,
    description: 'Steamed everything bagel, griddled egg, American cheese, Davey’s Delicious Sauce.',
    flair: 'Quietly perfect. The early-shift hero.',
    modifiers: sandwichModsWithBagel('everything') },
  { id: 'sausage-celebration', category: 'breakfast', name: 'Sausage Celebration', price: 10.50,
    description: 'Steamed plain bagel, griddled egg, ¼ lb. Wood Farms breakfast sausage patty, American + provolone + pepper jack, banana peppers.',
    flair: 'Three cheeses. One mood. Pure joy.',
    modifiers: sandwichModsWithBagel('plain') },
  { id: 'cream-cheese-8oz', category: 'breakfast', name: '8 oz. Cream Cheese', price: 6.25,
    description: 'A whole tub of the good stuff.',
    modifiers: [CREAM_CHEESE] },
  { id: 'bagel-of-the-week', category: 'breakfast', name: 'Bagel of the Week', price: 12.00,
    description: 'A rotating limited release. Ask the counter what’s on today.',
    flair: 'Blink and you’ll miss it.',
    modifiers: SANDWICH_MODS },

  // LUNCH & LOX
  { id: 'tincaps-turkey', category: 'lunch-lox', name: 'TinCaps Turkey', price: 10.50,
    description: 'Steamed everything bagel, veggie cream cheese, ¼ lb. oven-roasted turkey, tomato, banana peppers, S&P.',
    flair: 'Named for the boys of summer at Parkview Field.',
    modifiers: loxMods('everything') },
  { id: 'happy-hippy', category: 'lunch-lox', name: 'Happy Hippy', price: 10.50,
    description: 'Hummus, banana peppers, red onion, tomato, jalapeños, avocado, S&P, Davey’s Sauce on an everything bagel.',
    flair: 'Vegetarian. Maximalist. Vibrant.',
    modifiers: loxMods('everything') },
  { id: 'loxy-lady', category: 'lunch-lox', name: 'Loxy Lady', price: 14.00,
    description: 'Steamed everything bagel, house chive & onion cream cheese, ¼ lb. Atlantic lox, capers, cucumbers, red onion.',
    flair: 'The whole cinematic universe in one sandwich.',
    modifiers: loxMods('everything') },
  { id: 'lox-on-bagel', category: 'lunch-lox', name: 'Lox on a Bagel', price: 12.00,
    description: 'Steamed everything bagel, plain cream cheese, capers, ¼ lb. lox.',
    flair: 'For purists. You know who you are.',
    modifiers: loxMods('everything') },
  { id: 'lobster-roll', category: 'lunch-lox', name: 'Lobster Roll', price: 14.00,
    description: 'Toasted everything bagel, butter, lobster, celery, mayo, seasoning.',
    flair: 'Indiana doesn’t touch the ocean. We bring the ocean here.',
    modifiers: loxMods('everything') },

  // SWEET
  { id: 'the-una', category: 'sweet', name: 'The Una', price: 6.50,
    description: 'Toasted cinnamon raisin bagel, creamy peanut butter, banana slices, honey, cinnamon, sugar.',
    flair: 'Named after a girl. Sweet, warm, unforgettable.',
    modifiers: SWEET_BAGEL_MODS },
  { id: 'pb-and-j', category: 'sweet', name: 'PB & J', price: 5.19,
    description: 'Toasted cinnamon raisin bagel, creamy peanut butter, grape jelly.',
    flair: 'A grown-up’s second-grade lunchbox dream.',
    modifiers: [
      withDefault(BAGEL_CHOICE, 'cinnamon-raisin'),
      {
        id: 'jelly',
        label: 'Jelly',
        type: 'single',
        options: [
          { id: 'grape', label: 'Grape', default: true },
          { id: 'strawberry', label: 'Strawberry' },
          { id: 'raspberry', label: 'Raspberry' },
          { id: 'apricot', label: 'Apricot' },
        ],
      },
    ] },

  // BAGELS + CC
  { id: 'plain-bagel', category: 'bagels', name: 'Plain', price: 2.50, description: 'A blank canvas. We respect it.',
    modifiers: plainBagelMods('plain') },
  { id: 'everything-bagel', category: 'bagels', name: 'Everything', price: 2.00, description: 'Garlic, onion, poppy, sesame, salt. The hits.',
    modifiers: plainBagelMods('everything') },
  { id: 'asiago-bagel', category: 'bagels', name: 'Asiago', price: 2.50, description: 'Crisped cheese crown.',
    modifiers: plainBagelMods('asiago') },
  { id: 'jalapeno-cheddar-bagel', category: 'bagels', name: 'Jalapeño Cheddar', price: 2.50, description: 'Spicy. Cheesy. Loud.',
    modifiers: plainBagelMods('jalapeno-cheddar') },
  { id: 'gf-everything', category: 'bagels', name: 'GF Everything', price: 4.00, description: 'Gluten-free. Same goodness.', outOfStock: true },
  { id: 'gf-plain', category: 'bagels', name: 'GF Plain', price: 4.00, description: 'Gluten-free. Same goodness.',
    modifiers: plainBagelMods('gf-plain') },
  { id: 'blueberry-bagel', category: 'bagels', name: 'Blueberry', price: 2.00, description: 'Bursts of blue.',
    modifiers: plainBagelMods('plain') },
  { id: 'cinnamon-raisin-bagel', category: 'bagels', name: 'Cinnamon Raisin', price: 2.50, description: 'Sweet, swirly, perfect with butter.',
    modifiers: plainBagelMods('cinnamon-raisin') },
  { id: 'french-toast-bagel', category: 'bagels', name: 'French Toast', price: 2.50, description: 'Tastes like Saturday.',
    modifiers: plainBagelMods('french-toast') },

  // COFFEE
  { id: 'brewed-coffee', category: 'coffee', name: 'Brewed Coffee — Union Blend', price: 2.50, description: 'Local roaster, slow & honest.',
    modifiers: COFFEE_BLACK_MODS },
  { id: 'espresso', category: 'coffee', name: 'Espresso', price: 3.00, description: 'A small, mighty cup.',
    modifiers: [EXTRA_SHOTS, FLAVOR_SYRUP, SWEETENER] },
  { id: 'latte', category: 'coffee', name: 'Latte', price: 5.00, description: 'Espresso, steamed milk, a little foam.',
    modifiers: COFFEE_FULL_MODS },
  { id: 'cappuccino', category: 'coffee', name: 'Cappuccino', price: 5.00, description: 'Espresso, steamed milk, more foam.',
    modifiers: COFFEE_FULL_MODS },
  { id: 'americano', category: 'coffee', name: 'Americano', price: 3.50, description: 'Espresso & hot water.',
    modifiers: COFFEE_BLACK_MODS },
  { id: 'au-lait', category: 'coffee', name: 'Au Lait', price: 4.50, description: 'Brewed coffee + steamed milk.',
    modifiers: COFFEE_FULL_MODS },
  { id: 'red-eye', category: 'coffee', name: 'Red Eye', price: 5.50, description: 'Brewed coffee + 2 espresso shots. The 6 AM cure.',
    modifiers: COFFEE_FULL_MODS },
  { id: 'black-eye', category: 'coffee', name: 'Black Eye', price: 6.50, description: 'Union blend with 4 espresso shots. Use responsibly.',
    modifiers: COFFEE_FULL_MODS },
  { id: 'chai-latte', category: 'coffee', name: 'Chai Latte', price: 5.00, description: 'Chai + steamed milk.',
    modifiers: COFFEE_FULL_MODS },
  { id: 'dirty-chai', category: 'coffee', name: 'Dirty Chai', price: 6.50, description: 'Chai with espresso. Best of both.',
    modifiers: COFFEE_FULL_MODS },
  { id: 'steamer', category: 'coffee', name: 'Steamer', price: 3.50, description: 'Steamed or cold milk + flavor of choice.',
    modifiers: [HOT_OR_ICED, MILK_CHOICE, FLAVOR_SYRUP, SWEETENER] },

  // TEA
  { id: 'bagged-tea', category: 'tea', name: 'Bagged Tea', price: 2.59, description: 'Hot or iced (Bigelow).',
    modifiers: TEA_BAGGED_MODS },
  { id: 'tea-latte', category: 'tea', name: 'Tea Latte', price: 3.63, description: 'Hot or iced. Choose your tea + syrup.',
    modifiers: TEA_LATTE_MODS },

  // SOUPS
  { id: 'seasonal-soup', category: 'soups', name: 'Seasonal Soup', price: 5.00, description: 'Whatever the kitchen is in love with this week.', outOfStock: true },

  // DRINKS
  { id: 'soda-pop', category: 'drinks', name: 'Soda Pop', price: 1.50, description: '12 oz. canned, cold.' },
  { id: 'lemonade', category: 'drinks', name: 'Lemonade', price: 3.00, description: 'Original or your choice of flavor.',
    modifiers: [LEMONADE_FLAVOR] },
  { id: 'oj', category: 'drinks', name: 'Orange Juice', price: 3.00 },
  { id: 'water-bottle', category: 'drinks', name: 'Water Bottle', price: 1.50, description: '16 oz.' },
  { id: 'sparkling', category: 'drinks', name: 'Sparkling Mineral Water', price: 2.50, description: 'Perrier.' },

  // SIDES
  { id: 'chips', category: 'sides', name: 'Chips', price: 1.30, description: 'Lay’s, 1.5 oz.' },
  { id: 'dill-spear', category: 'sides', name: 'Dill Spear', price: 1.30, description: 'Crisp, cold, brined just right.' },
  { id: 'rice-crispy', category: 'sides', name: 'Rice Crispy Treat', price: 1.04 },
  { id: 'fruit-parfait', category: 'sides', name: 'Fruit Parfait', price: 7.25, description: '8 oz., layered & lovely.' },
  { id: 'cream-cheese-danish', category: 'sides', name: 'Cream Cheese Danish', price: 4.00 },
  { id: 'apple-danish', category: 'sides', name: 'Apple Danish', price: 4.00 },
  { id: 'brownie', category: 'sides', name: 'Brownie', price: 4.00 },
  { id: 'blueberry-muffin', category: 'sides', name: 'Blueberry Cream Muffin', price: 4.00 },
  { id: 'dds-8oz', category: 'sides', name: 'Davey’s Delicious Sauce — 8 oz.', price: 8.00, description: 'Take the magic home.' },
  { id: 'dds-refill', category: 'sides', name: 'DDS Refill — 8 oz.', price: 4.00 },
  { id: 'hashbrowns', category: 'sides', name: 'Hashbrowns', price: 2.00 },
  { id: 'smores-cookie', category: 'sides', name: 'S’mores Cookie', price: 5.00 },
  { id: 'snickerdoodle', category: 'sides', name: 'Snickerdoodle Cookie', price: 5.00 },

  // BULK
  { id: 'six-pack', category: 'bulk', name: '6-Pack of Bagels', price: 12.00, description: 'Half a dozen. Mix & match.' },
  { id: 'six-pack-cc', category: 'bulk', name: '6-Pack + Cream Cheese', price: 18.50 },
  { id: 'dozen', category: 'bulk', name: 'Dozen Bagels', price: 18.00 },
  { id: 'dozen-cc', category: 'bulk', name: 'Dozen + Cream Cheese', price: 35.00, description: 'A breakfast for the whole office.' },

  // SWAG — apparel needs sizes (otherwise we can't ship it).
  { id: 'trucker-hat', category: 'swag', name: 'Trucker Hat', price: 20.00, description: 'Davey’s logo, snap-back, instantly cooler.',
    modifiers: [HAT_COLOR] },
  { id: 'crewneck', category: 'swag', name: 'Crewneck Sweater', price: 45.00,
    modifiers: [APPAREL_SIZE] },
  { id: 'tshirt-hat', category: 'swag', name: 'T-shirt + Hat Combo', price: 40.00,
    modifiers: [
      { ...APPAREL_SIZE, id: 'shirt-size', label: 'T-shirt Size' },
      HAT_COLOR,
    ] },
  { id: 'sweatshirt-hat', category: 'swag', name: 'Sweatshirt + Hat Combo', price: 60.00,
    modifiers: [
      { ...APPAREL_SIZE, id: 'sweatshirt-size', label: 'Sweatshirt Size' },
      HAT_COLOR,
    ] },
  { id: 'hat-trick', category: 'swag', name: 'Hat Trick: All Three', price: 85.00, description: 'T-shirt, sweatshirt, hat. Be the bagel.',
    modifiers: [
      { ...APPAREL_SIZE, id: 'shirt-size', label: 'T-shirt Size' },
      { ...APPAREL_SIZE, id: 'sweatshirt-size', label: 'Sweatshirt Size' },
      HAT_COLOR,
    ] },
  { id: 'mug-20', category: 'swag', name: '20 oz. Mug', price: 17.50 },
  { id: 'mug-12', category: 'swag', name: '12 oz. Mug', price: 15.50 },
]
