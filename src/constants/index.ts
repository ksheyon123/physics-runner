const SORT_OF_PATH = "physics";

type SortOfPath = "drop-mass";

type OptionBoxItem = {
  key: string;
  label: string;
  unit: string;
};

export const NAV_ITEMS = [
  { label: "gravity", key: 1, link: `${SORT_OF_PATH}/drop-mass` },
  {
    label: "energy",
    key: 2,
    link: `${SORT_OF_PATH}/potential-kinetic`,
  },
  {
    label: "impulse",
    key: 3,
    link: `${SORT_OF_PATH}/potential-kinetic`,
  },
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
