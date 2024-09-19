import { Gauge } from "@/components/Gauge/Gauge";

const PHYSICS = "physics";
const TUTORIAL = "tutorial";
const MESH = "mesh";

type SortOfPath = "free-fall";

export type OptionBoxItem = {
  id: string;
  label: string;
  unit: string;
  min?: string | number;
  max?: string | number;
  initValue?: number;
  disabled?: boolean;
  renderer?: (props: any) => JSX.Element;
};

export const NAV_PHYSICS_ITEMS = [
  { label: "Free Fall", key: 1, link: `${PHYSICS}/free-fall` },
  {
    label: "Potential Energy",
    key: 2,
    link: `${PHYSICS}/potential-kinetic`,
  },
  {
    label: "Angular Momentum",
    key: 3,
    link: `${PHYSICS}/angular-momentum`,
  },
];

export const NAV_TEST_ITEMS = [
  { label: "Collision", key: 1, link: `${TUTORIAL}/collision-check` },
];

export const MESH_TEST_ITEMS = [
  { label: "Joint", key: 1, link: `${MESH}/joint` },
];

export const OPTION_BOX_ITEMS: { [key in SortOfPath]: OptionBoxItem[] } = {
  "free-fall": [
    {
      label: "Drag Coefficient",
      id: "cd",
      unit: "",
      min: 0,
      max: 1.25,
      initValue: 0,
      renderer: (props: any) => <Gauge {...props} />,
    },
    {
      label: "Gravity",
      id: "g",
      unit: "m / s**2",
      initValue: 9.81,
      disabled: true,
      renderer: (props: any) => <Gauge {...props} />,
    },
    {
      label: "Mass",
      id: "mass",
      unit: "kg",
      min: 1,
      max: 10,
      initValue: 1,
      renderer: (props: any) => <Gauge {...props} />,
    },
  ],
};