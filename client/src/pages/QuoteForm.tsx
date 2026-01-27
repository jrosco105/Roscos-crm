import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { PayPalButton } from "@/components/PayPalButton";

// Room inventory options
const ROOM_INVENTORY = {
  "Living Room": [
    "Sofa",
    "Coffee Table",
    "TV Stand",
    "Bookshelf",
    "Armchair",
    "Side Table",
    "Lamp",
    "Rug",
  ],
  "Master Bedroom": [
    "Bed Frame (Queen)",
    "Bed Frame (King)",
    "Bed Frame (Twin)",
    "Nightstands",
    "Dresser",
    "Wardrobe",
    "Desk",
    "Mirror",
  ],
  "Bedroom": [
    "Bed Frame (Twin)",
    "Bed Frame (Full)",
    "Nightstand",
    "Dresser",
    "Desk",
    "Bookshelf",
    "Lamp",
  ],
  "Kitchen": [
    "Refrigerator",
    "Stove/Range",
    "Dishwasher",
    "Microwave",
    "Kitchen Table",
    "Kitchen Chairs",
    "Cabinets",
    "Island",
  ],
  "Bathroom": [
    "Vanity",
    "Mirror",
    "Shelving",
    "Towel Rack",
    "Toilet Brush Holder",
  ],
  "Dining Room": [
    "Dining Table",
    "Dining Chairs",
    "China Cabinet",
    "Buffet",
    "Chandelier",
  ],
  "Office": [
    "Desk",
    "Office Chair",
    "Bookshelf",
    "Filing Cabinet",
    "Computer Equipment",
    "Lamp",
  ],
  "Garage": [
    "Tool Chest",
    "Workbench",
    "Shelving",
    "Bicycles",
    "Sports Equipment",
  ],
  "Storage/Other": [
    "Boxes",
    "Storage Bins",
    "Luggage",
    "Outdoor Furniture",
    "Garden Equipment",
  ],
};

const APPLIANCES = [
  "Washer",
  "Dryer",
  "Refrigerator",
  "Stove/Range",
  "Dishwasher",
  "Microwave",
  "Air Conditioner Unit",
  "Furnace/HVAC",
];

const SPECIAL_ITEMS = [
  "Stairs (Single Flight)",
  "Stairs (Multiple Flights)",
  "Elevator Access",
  "Piano",
  "Pool Table",
  "Treadmill",
  "Motorcycle",
  "Antiques/Fragile Items",
];

type Step = "details" | "inventory" | "appliances" | "special" | "review";

export default function QuoteForm() {
  const [step, setStep] = useState<Step>("details");
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [moveDate, setMoveDate] = useState("");
  const [originZip, setOriginZip] = useState("");
  const [destinationZip, setDestinationZip] = useState("");
  const [homeSize, setHomeSize] = useState<"studio" | "1bed" | "2bed" | "3bed" | "4bed" | "5bed_plus" | "commercial">("2bed");

  // Inventory state
  const [selectedRooms, setSelectedRooms] = useState<Record<string, string[]>>({});
  const [selectedAppliances, setSelectedAppliances] = useState<string[]>([]);
  const [selectedSpecialItems, setSelectedSpecialItems] = useState<string[]>([]);

  // Quote state
  const [quote, setQuote] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // API calls
  const calculateQuoteMutation = trpc.quote.calculate.useMutation();
  const createLeadMutation = trpc.lead.create.useMutation();

  const handleRoomItemToggle = (room: string, item: string) => {
    setSelectedRooms((prev) => {
      const roomItems = prev[room] || [];
      if (roomItems.includes(item)) {
        return {
          ...prev,
          [room]: roomItems.filter((i) => i !== item),
        };
      } else {
        return {
          ...prev,
          [room]: [...roomItems, item],
        };
      }
    });
  };

  const handleApplianceToggle = (appliance: string) => {
    setSelectedAppliances((prev) =>
      prev.includes(appliance) ? prev.filter((a) => a !== appliance) : [...prev, appliance]
    );
  };

  const handleSpecialItemToggle = (item: string) => {
    setSelectedSpecialItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleCalculateQuote = async () => {
    setIsCalculating(true);
    try {
      const result = await calculateQuoteMutation.mutateAsync({
        originZip,
        destinationZip,
        homeSize,
      });
      setQuote(result);
      setStep("review");
    } catch (error) {
      toast.error("Failed to calculate quote");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSubmitQuote = async () => {
    setIsCalculating(true);
    try {
      await createLeadMutation.mutateAsync({
        customerName,
        customerEmail,
        customerPhone,
        moveDate: new Date(moveDate),
        originZip,
        destinationZip,
        homeSize,
        inventory: {
          rooms: selectedRooms,
          appliances: selectedAppliances,
          specialItems: selectedSpecialItems,
        },
      });

      setSubmitted(true);
      toast.success("Quote request submitted! We'll contact you shortly.");
    } catch (error) {
      toast.error("Failed to submit quote request");
    } finally {
      setIsCalculating(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-12 pb-12 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-foreground mb-4">Quote Request Submitted!</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Thank you, {customerName}! We've received your quote request and will review it shortly.
              </p>
              <p className="text-muted-foreground mb-8">
                We'll contact you at {customerPhone} or {customerEmail} with your personalized quote within 24 hours.
              </p>
              <Button onClick={() => window.location.href = "/"} size="lg">
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            <div className={`text-sm font-medium ${step === "details" ? "text-blue-600" : "text-gray-400"}`}>
              Your Details
            </div>
            <div className={`text-sm font-medium ${step === "inventory" ? "text-blue-600" : "text-gray-400"}`}>
              Inventory
            </div>
            <div className={`text-sm font-medium ${step === "appliances" ? "text-blue-600" : "text-gray-400"}`}>
              Appliances
            </div>
            <div className={`text-sm font-medium ${step === "special" ? "text-blue-600" : "text-gray-400"}`}>
              Special Items
            </div>
            <div className={`text-sm font-medium ${step === "review" ? "text-blue-600" : "text-gray-400"}`}>
              Review
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{
                width:
                  step === "details"
                    ? "20%"
                    : step === "inventory"
                      ? "40%"
                      : step === "appliances"
                        ? "60%"
                        : step === "special"
                          ? "80%"
                          : "100%",
              }}
            />
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>
              {step === "details"
                ? "Your Contact Information"
                : step === "inventory"
                  ? "What Are You Moving?"
                  : step === "appliances"
                    ? "Do You Have These Appliances?"
                    : step === "special"
                      ? "Any Special Items?"
                      : "Review Your Quote"}
            </CardTitle>
            <CardDescription>
              {step === "details"
                ? "Let us know how to reach you"
                : step === "inventory"
                  ? "Select items from each room"
                  : step === "appliances"
                    ? "Check any appliances you're moving"
                    : step === "special"
                      ? "Select any special items or conditions"
                      : "Review your quote details"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Details */}
            {step === "details" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="moveDate">Planned Move Date</Label>
                  <Input
                    id="moveDate"
                    type="date"
                    value={moveDate}
                    onChange={(e) => setMoveDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="originZip">Current Location (ZIP Code)</Label>
                  <Input
                    id="originZip"
                    value={originZip}
                    onChange={(e) => setOriginZip(e.target.value)}
                    placeholder="12345"
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="destZip">New Location (ZIP Code)</Label>
                  <Input
                    id="destZip"
                    value={destinationZip}
                    onChange={(e) => setDestinationZip(e.target.value)}
                    placeholder="54321"
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="homeSize">Home Size</Label>
                  <Select value={homeSize} onValueChange={(value: any) => setHomeSize(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="1bed">1 Bedroom</SelectItem>
                      <SelectItem value="2bed">2 Bedrooms</SelectItem>
                      <SelectItem value="3bed">3 Bedrooms</SelectItem>
                      <SelectItem value="4bed">4 Bedrooms</SelectItem>
                      <SelectItem value="5bed_plus">5+ Bedrooms</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 2: Inventory */}
            {step === "inventory" && (
              <div className="space-y-6">
                {Object.entries(ROOM_INVENTORY).map(([room, items]) => (
                  <div key={room} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-3">{room}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {items.map((item) => (
                        <div key={item} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${room}-${item}`}
                            checked={selectedRooms[room]?.includes(item) || false}
                            onCheckedChange={() => handleRoomItemToggle(room, item)}
                          />
                          <Label htmlFor={`${room}-${item}`} className="cursor-pointer text-sm">
                            {item}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 3: Appliances */}
            {step === "appliances" && (
              <div className="space-y-3">
                {APPLIANCES.map((appliance) => (
                  <div key={appliance} className="flex items-center space-x-2">
                    <Checkbox
                      id={`appliance-${appliance}`}
                      checked={selectedAppliances.includes(appliance)}
                      onCheckedChange={() => handleApplianceToggle(appliance)}
                    />
                    <Label htmlFor={`appliance-${appliance}`} className="cursor-pointer">
                      {appliance}
                    </Label>
                  </div>
                ))}
              </div>
            )}

            {/* Step 4: Special Items */}
            {step === "special" && (
              <div className="space-y-3">
                {SPECIAL_ITEMS.map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={`special-${item}`}
                      checked={selectedSpecialItems.includes(item)}
                      onCheckedChange={() => handleSpecialItemToggle(item)}
                    />
                    <Label htmlFor={`special-${item}`} className="cursor-pointer">
                      {item}
                    </Label>
                  </div>
                ))}
              </div>
            )}

            {/* Step 5: Review */}
            {step === "review" && (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">Estimated Quote</h3>
                  {quote ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Base Cost:</span>
                        <span className="font-medium">${quote.baseCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Distance ({quote.estimatedDistance} mi):</span>
                        <span className="font-medium">${quote.distanceCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Labor:</span>
                        <span className="font-medium">${quote.laborCost}</span>
                      </div>
                      <div className="border-t pt-2 mt-2 flex justify-between">
                        <span className="font-semibold text-foreground">Total Estimate:</span>
                        <span className="text-2xl font-bold text-blue-600">${quote.totalCost}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Calculating quote...</p>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> This is an estimated quote based on the information provided. Our team will review your request and contact you with a final quote within 24 hours.
                  </p>
                </div>
              </div>
            )}
          </CardContent>

          {/* Navigation buttons */}
          <div className="flex justify-between p-6 border-t">
            <Button
              variant="outline"
              onClick={() => {
                if (step === "details") return;
                const steps: Step[] = ["details", "inventory", "appliances", "special", "review"];
                const currentIndex = steps.indexOf(step);
                setStep(steps[currentIndex - 1]);
              }}
              disabled={step === "details"}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {step !== "review" ? (
              <Button
                onClick={() => {
                  if (step === "details" && (!customerName || !customerPhone || !originZip || !destinationZip || !moveDate)) {
                    toast.error("Please fill in all required fields");
                    return;
                  }
                  const steps: Step[] = ["details", "inventory", "appliances", "special", "review"];
                  const currentIndex = steps.indexOf(step);
                  if (currentIndex === 3) {
                    handleCalculateQuote();
                  } else {
                    setStep(steps[currentIndex + 1]);
                  }
                }}
                disabled={isCalculating}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmitQuote} disabled={isCalculating} className="bg-green-600 hover:bg-green-700">
                {isCalculating ? "Submitting..." : "Submit Quote Request"}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
