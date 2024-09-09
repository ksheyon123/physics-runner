import { Gauge } from "@/components/Gauge/Gauge";

const PHYSICS = "physics";
const TUTORIAL = "tutorial";

type SortOfPath = "free-fall";

type OptionBoxItem = {
  key: string;
  label: string;
  unit: string;
  min?: number;
  max?: number;
  renderer?: (props: any) => JSX.Element;
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
  "free-fall": [
    {
      label: "Drag Coefficient",
      key: "cd",
      unit: "",
      min: 0,
      max: 0,
      renderer: (props: any) => <></>,
    },
    {
      label: "Gravity",
      key: "g",
      unit: "m / s**2",
      min: 0,
      max: 0,
    },
    {
      label: "Mass",
      key: "mass",
      unit: "kg",
      min: 0,
      max: 0,
    },
  ],
};
