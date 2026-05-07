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
}

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
    flair: 'The original. The reason we get out of bed.' },
  { id: 'thicc-beef-bacon', category: 'breakfast', name: 'Thicc Cut Beef Bacon, Egg & Cheese', price: 11.50,
    description: 'Steamed plain bagel, griddled egg, 4 oz. of thicc-cut Wood Farms beef bacon, American cheese.',
    flair: 'Yes, three c’s. Yes, it’s necessary.' },
  { id: 'the-07', category: 'breakfast', name: 'The 07 (oh-seven)', price: 10.50,
    description: 'Steamed everything bagel, 3 thick slices of turkey bacon, griddled egg, American cheese, avocado.',
    flair: 'Numbered, beloved, never duplicated.' },
  { id: 'el-guapo', category: 'breakfast', name: 'El Guapo', price: 11.50,
    description: 'Steamed asiago bagel, turkey bacon, ⅛ lb. pork sausage, griddled egg, American cheese, Davey’s Delicious Sauce.',
    flair: 'Handsome. Powerful. A little dangerous.' },
  { id: 'the-mad-ant', category: 'breakfast', name: 'The Mad Ant', price: 11.00,
    description: 'Sausage patty, griddled egg, pepper jack, jalapeños, Davey’s Delicious Sauce.',
    flair: 'For the Coliseum faithful.' },
  { id: 'beef-bacon-bandit', category: 'breakfast', name: 'Beef Bacon Bandit', price: 13.50,
    description: 'Steamed asiago bagel, 3 oz. Wood Farms beef bacon, griddled egg, cheddar, red onion, banana peppers, avocado.',
    flair: 'Steals the show. Returns it slightly improved.' },
  { id: 'turkey-bacon-egg-cheese', category: 'breakfast', name: 'Turkey Bacon, Egg & Cheese', price: 9.00,
    description: 'Steamed plain bagel, ¼ lb. thicc-cut turkey bacon, griddled egg, American cheese.' },
  { id: 'pork-bacon-egg-cheese', category: 'breakfast', name: 'Pork Bacon, Egg & Cheese', price: 9.00,
    description: 'A timeless Tuesday morning.' },
  { id: 'sunrise-special', category: 'breakfast', name: 'Sunrise Special', price: 6.25,
    description: 'Steamed everything bagel, griddled egg, American cheese, Davey’s Delicious Sauce.',
    flair: 'Quietly perfect. The early-shift hero.' },
  { id: 'sausage-celebration', category: 'breakfast', name: 'Sausage Celebration', price: 10.50,
    description: 'Steamed plain bagel, griddled egg, ¼ lb. Wood Farms breakfast sausage patty, American + provolone + pepper jack, banana peppers.',
    flair: 'Three cheeses. One mood. Pure joy.' },
  { id: 'cream-cheese-8oz', category: 'breakfast', name: '8 oz. Cream Cheese', price: 6.25,
    description: 'A whole tub of the good stuff.' },
  { id: 'bagel-of-the-week', category: 'breakfast', name: 'Bagel of the Week', price: 12.00,
    description: 'A rotating limited release. Ask the counter what’s on today.',
    flair: 'Blink and you’ll miss it.' },

  // LUNCH & LOX
  { id: 'tincaps-turkey', category: 'lunch-lox', name: 'TinCaps Turkey', price: 10.50,
    description: 'Steamed everything bagel, veggie cream cheese, ¼ lb. oven-roasted turkey, tomato, banana peppers, S&P.',
    flair: 'Named for the boys of summer at Parkview Field.' },
  { id: 'happy-hippy', category: 'lunch-lox', name: 'Happy Hippy', price: 10.50,
    description: 'Hummus, banana peppers, red onion, tomato, jalapeños, avocado, S&P, Davey’s Sauce on an everything bagel.',
    flair: 'Vegetarian. Maximalist. Vibrant.' },
  { id: 'loxy-lady', category: 'lunch-lox', name: 'Loxy Lady', price: 14.00,
    description: 'Steamed everything bagel, house chive & onion cream cheese, ¼ lb. Atlantic lox, capers, cucumbers, red onion.',
    flair: 'The whole cinematic universe in one sandwich.' },
  { id: 'lox-on-bagel', category: 'lunch-lox', name: 'Lox on a Bagel', price: 12.00,
    description: 'Steamed everything bagel, plain cream cheese, capers, ¼ lb. lox.',
    flair: 'For purists. You know who you are.' },
  { id: 'lobster-roll', category: 'lunch-lox', name: 'Lobster Roll', price: 14.00,
    description: 'Toasted everything bagel, butter, lobster, celery, mayo, seasoning.',
    flair: 'Indiana doesn’t touch the ocean. We bring the ocean here.' },

  // SWEET
  { id: 'the-una', category: 'sweet', name: 'The Una', price: 6.50,
    description: 'Toasted cinnamon raisin bagel, creamy peanut butter, banana slices, honey, cinnamon, sugar.',
    flair: 'Named after a girl. Sweet, warm, unforgettable.' },
  { id: 'pb-and-j', category: 'sweet', name: 'PB & J', price: 5.19,
    description: 'Toasted cinnamon raisin bagel, creamy peanut butter, grape jelly.',
    flair: 'A grown-up’s second-grade lunchbox dream.' },

  // BAGELS + CC
  { id: 'plain-bagel', category: 'bagels', name: 'Plain', price: 2.50, description: 'A blank canvas. We respect it.' },
  { id: 'everything-bagel', category: 'bagels', name: 'Everything', price: 2.00, description: 'Garlic, onion, poppy, sesame, salt. The hits.' },
  { id: 'asiago-bagel', category: 'bagels', name: 'Asiago', price: 2.50, description: 'Crisped cheese crown.' },
  { id: 'jalapeno-cheddar-bagel', category: 'bagels', name: 'Jalapeño Cheddar', price: 2.50, description: 'Spicy. Cheesy. Loud.' },
  { id: 'gf-everything', category: 'bagels', name: 'GF Everything', price: 4.00, description: 'Gluten-free. Same goodness.', outOfStock: true },
  { id: 'gf-plain', category: 'bagels', name: 'GF Plain', price: 4.00, description: 'Gluten-free. Same goodness.' },
  { id: 'blueberry-bagel', category: 'bagels', name: 'Blueberry', price: 2.00, description: 'Bursts of blue.' },
  { id: 'cinnamon-raisin-bagel', category: 'bagels', name: 'Cinnamon Raisin', price: 2.50, description: 'Sweet, swirly, perfect with butter.' },
  { id: 'french-toast-bagel', category: 'bagels', name: 'French Toast', price: 2.50, description: 'Tastes like Saturday.' },

  // COFFEE
  { id: 'brewed-coffee', category: 'coffee', name: 'Brewed Coffee — Union Blend', price: 2.50, description: 'Local roaster, slow & honest.' },
  { id: 'espresso', category: 'coffee', name: 'Espresso', price: 3.00, description: 'A small, mighty cup.' },
  { id: 'latte', category: 'coffee', name: 'Latte', price: 5.00, description: 'Espresso, steamed milk, a little foam.' },
  { id: 'cappuccino', category: 'coffee', name: 'Cappuccino', price: 5.00, description: 'Espresso, steamed milk, more foam.' },
  { id: 'americano', category: 'coffee', name: 'Americano', price: 3.50, description: 'Espresso & hot water.' },
  { id: 'au-lait', category: 'coffee', name: 'Au Lait', price: 4.50, description: 'Brewed coffee + steamed milk.' },
  { id: 'red-eye', category: 'coffee', name: 'Red Eye', price: 5.50, description: 'Brewed coffee + 2 espresso shots. The 6 AM cure.' },
  { id: 'black-eye', category: 'coffee', name: 'Black Eye', price: 6.50, description: 'Union blend with 4 espresso shots. Use responsibly.' },
  { id: 'chai-latte', category: 'coffee', name: 'Chai Latte', price: 5.00, description: 'Chai + steamed milk.' },
  { id: 'dirty-chai', category: 'coffee', name: 'Dirty Chai', price: 6.50, description: 'Chai with espresso. Best of both.' },
  { id: 'steamer', category: 'coffee', name: 'Steamer', price: 3.50, description: 'Steamed or cold milk + flavor of choice.' },

  // TEA
  { id: 'bagged-tea', category: 'tea', name: 'Bagged Tea', price: 2.59, description: 'Hot or iced (Bigelow).' },
  { id: 'tea-latte', category: 'tea', name: 'Tea Latte', price: 3.63, description: 'Hot or iced. Choose your tea + syrup.' },

  // SOUPS
  { id: 'seasonal-soup', category: 'soups', name: 'Seasonal Soup', price: 5.00, description: 'Whatever the kitchen is in love with this week.', outOfStock: true },

  // DRINKS
  { id: 'soda-pop', category: 'drinks', name: 'Soda Pop', price: 1.50, description: '12 oz. canned, cold.' },
  { id: 'lemonade', category: 'drinks', name: 'Lemonade', price: 3.00, description: 'Original or your choice of flavor.' },
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

  // SWAG
  { id: 'trucker-hat', category: 'swag', name: 'Trucker Hat', price: 20.00, description: 'Davey’s logo, snap-back, instantly cooler.' },
  { id: 'crewneck', category: 'swag', name: 'Crewneck Sweater', price: 45.00 },
  { id: 'tshirt-hat', category: 'swag', name: 'T-shirt + Hat Combo', price: 40.00 },
  { id: 'sweatshirt-hat', category: 'swag', name: 'Sweatshirt + Hat Combo', price: 60.00 },
  { id: 'hat-trick', category: 'swag', name: 'Hat Trick: All Three', price: 85.00, description: 'T-shirt, sweatshirt, hat. Be the bagel.' },
  { id: 'mug-20', category: 'swag', name: '20 oz. Mug', price: 17.50 },
  { id: 'mug-12', category: 'swag', name: '12 oz. Mug', price: 15.50 },
]
