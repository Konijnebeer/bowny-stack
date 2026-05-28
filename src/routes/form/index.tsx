import { Badge } from "#/components/ui/badge"
import { Button } from "#/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute("/form/")({
  component: RouteComponent,
})

const cards = [
  {
    title: "Input",
    description: "Simple input elements with simple defaults",
    link: "/form/example/input",
    tags: ["text"],
  },
  {
    title: "Password",
    description: "Password input with show/hide toggle",
    link: "/form/example/password",
    tags: ["text"],
  },
  {
    title: "Number Input",
    description: "Numeric input with increment/decrement controls",
    link: "/form/example/number-input",
    tags: ["text"],
  },
  {
    title: "Text Area",
    description: "Multi-line text input with max character counter",
    link: "/form/example/text-area",
    tags: ["text"],
  },
  {
    title: "Input Group",
    description: "Input with prefix/suffix addons (https, search, icons, etc.)",
    link: "/form/example/input-group",
    tags: ["text"],
  },
  {
    title: "OTP",
    description: "One-time password digit input with auto-advance",
    link: "/form/example/otp",
    tags: ["text"],
  },
  {
    title: "Tags",
    description: "Freeform tag entry with add and remove controls",
    link: "/form/example/tags",
    tags: ["text"],
  },
  {
    title: "Phone Input",
    description: "Phone number input with country code selector",
    link: "/form/example/phone-input",
    tags: ["text", "selection"],
  },
  {
    title: "Currency Input",
    description: "Monetary input with currency symbol and formatting",
    link: "/form/example/currency-input",
    tags: ["text"],
  },

  {
    title: "Select",
    description: "Dropdown with single and multi-select options",
    link: "/form/example/select",
    tags: ["selection"],
  },
  {
    title: "Combobox",
    description: "Searchable select with keyboard navigation",
    link: "/form/example/combobox",
    tags: ["selection"],
  },
  {
    title: "Radio Group",
    description: "Mutually exclusive option group",
    link: "/form/example/radio-group",
    tags: ["selection"],
  },
  {
    title: "Checkbox",
    description:
      "Single and grouped checkbox controls with indeterminate state",
    link: "/form/example/checkbox",
    tags: ["selection"],
  },
  {
    title: "Switch",
    description: "Binary toggle switch for on/off states",
    link: "/form/example/switch",
    tags: ["selection"],
  },
  {
    title: "Toggle",
    description: "Pressable toggle button, single and grouped",
    link: "/form/example/toggle",
    tags: ["selection"],
  },
  {
    title: "Selection",
    description: "Visual card-style option picker, single and multi",
    link: "/form/example/selection",
    tags: ["selection"],
  },

  {
    title: "Date Picker",
    description: "Calendar-based date selector",
    link: "/form/example/date-picker",
    tags: ["picker", "temporal"],
  },
  {
    title: "Time Picker",
    description: "Clock or scroll-based time selector",
    link: "/form/example/time-picker",
    tags: ["picker", "temporal"],
  },
  {
    title: "Date Time Picker",
    description: "Combined date and time selection in one control",
    link: "/form/example/date-time-picker",
    tags: ["picker", "temporal"],
  },
  {
    title: "Color Picker",
    description: "Swatch, hex, and HSL color selection",
    link: "/form/example/color-picker",
    tags: ["picker"],
  },
  {
    title: "File Input",
    description: "File upload with drag-and-drop and preview",
    link: "/form/example/file-input",
    tags: ["picker"],
  },

  {
    title: "Slider",
    description: "Single value and range slider controls",
    link: "/form/example/slider",
    tags: ["range"],
  },
  {
    title: "Rating",
    description: "Star or icon-based rating input",
    link: "/form/example/rating",
    tags: ["range"],
  },

  {
    title: "Rank Order",
    description: "Drag-to-reorder list of options via DnD Kit",
    link: "/form/example/rank-order",
    tags: ["advanced"],
  },
]

function RouteComponent() {
  return (
    <>
      <h1 className="text-center text-4xl font-bold">Form</h1>
      <div className="mt-10 grid grid-cols-1 place-items-center gap-4 md:grid-cols-2 lg:grid-cols-3 lg:place-items-start">
        {cards.map((card, i) => (
          <Card key={i} className="h-full w-full max-w-xs">
            <CardHeader>
              <CardTitle>
                <h2>{card.title}</h2>
              </CardTitle>
              <CardDescription className="flex flex-wrap gap-1">
                {card.tags.map((tag, j) => (
                  <Badge key={j} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-full">{card.description}</CardContent>
            <CardFooter>
              <Button
                render={<Link to={card.link} />}
                nativeButton={false}
                className="ml-auto"
              >
                To Example
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  )
}
