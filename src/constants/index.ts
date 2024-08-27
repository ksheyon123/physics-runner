const PHYSICS = "physics";
const TUTORIAL = "tutorial";

type SortOfPath = "drop-mass";

type OptionBoxItem = {
  key: string;
  label: string;
  unit: string;
};

export const NAV_PHYSICS_ITEMS = [
  { label: "Free Fall", key: 1, link: `${PHYSICS}/free-fall` },
  {
    label: "energy",
    key: 2,
    link: `${PHYSICS}/potential-kinetic`,
  },
];

export const NAV_TEST_ITEMS = [
  { label: "Collision", key: 1, link: `${TUTORIAL}/collision-check` },
];

export const OPTION_BOX_ITEMS: { [key in SortOfPath]: OptionBoxItem[] } = {
  "drop-mass": [
    {
      label: "Drag Coefficient",
      key: "cd",
      unit: "",
    },
    {
      label: "Gravity",
      key: "g",
      unit: "m / s**2",
    },
    {
      label: "Mass",
      key: "mass",
      unit: "kg",
    },
  ],
};
