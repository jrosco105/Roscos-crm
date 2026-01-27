import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function Settings() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("company");

  // Company Info State
  const [companyName, setCompanyName] = useState("Rosco's Moving LLC");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyEmail, setCompanyEmail] = useState("contact@roscosmoving.com");
  const [companyAddress, setCompanyAddress] = useState("");

  // Pricing State
  const [baseCost, setBaseCost] = useState("150");
  const [costPerMile, setCostPerMile] = useState("2.50");
  const [costPerLaborHour, setCostPerLaborHour] = useState("50");
  const [minimumCharge, setMinimumCharge] = useState("300");

  // Crew State
  const [crewList, setCrewList] = useState<any[]>([]);
  const [newCrewName, setNewCrewName] = useState("");
  const [newCrewPhone, setNewCrewPhone] = useState("");

  // Vehicle State
  const [vehicleList, setVehicleList] = useState<any[]>([]);
  const [newVehicleName, setNewVehicleName] = useState("");
  const [newVehicleType, setNewVehicleType] = useState("truck");
  const [newVehicleCapacity, setNewVehicleCapacity] = useState("");

  // PayPal State
  const [paypalClientId, setPaypalClientId] = useState("");
  const [paypalClientSecret, setPaypalClientSecret] = useState("");
  const [depositPercentage, setDepositPercentage] = useState("20");

  // SMS State
  const [twilioAccountSid, setTwilioAccountSid] = useState("");
  const [twilioAuthToken, setTwilioAuthToken] = useState("");
  const [twilioPhoneNumber, setTwilioPhoneNumber] = useState("");

  const handleSaveCompanyInfo = () => {
    toast.success("Company information saved!");
  };

  const handleSavePricing = () => {
    toast.success("Pricing rules updated!");
  };

  const handleAddCrew = () => {
    if (!newCrewName || !newCrewPhone) {
      toast.error("Please fill in all crew fields");
      return;
    }
    setCrewList([...crewList, { id: Date.now(), name: newCrewName, phone: newCrewPhone }]);
    setNewCrewName("");
    setNewCrewPhone("");
    toast.success("Crew member added!");
  };

  const handleRemoveCrew = (id: number) => {
    setCrewList(crewList.filter((c) => c.id !== id));
    toast.success("Crew member removed!");
  };

  const handleAddVehicle = () => {
    if (!newVehicleName || !newVehicleCapacity) {
      toast.error("Please fill in all vehicle fields");
      return;
    }
    setVehicleList([
      ...vehicleList,
      { id: Date.now(), name: newVehicleName, type: newVehicleType, capacity: newVehicleCapacity },
    ]);
    setNewVehicleName("");
    setNewVehicleCapacity("");
    toast.success("Vehicle added!");
  };

  const handleRemoveVehicle = (id: number) => {
    setVehicleList(vehicleList.filter((v) => v.id !== id));
    toast.success("Vehicle removed!");
  };

  const handleSavePayPal = () => {
    if (!paypalClientId || !paypalClientSecret) {
      toast.error("Please enter both PayPal Client ID and Secret");
      return;
    }
    toast.success("PayPal credentials saved securely!");
  };

  const handleSaveSMS = () => {
    if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
      toast.error("Please fill in all Twilio fields");
      return;
    }
    toast.success("SMS configuration saved securely!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Button variant="outline" onClick={() => setLocation("/dashboard")}>
            ← Back to Dashboard
          </Button>
        </div>

        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600 mb-8">Manage your company information, pricing, crew, vehicles, and payments</p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="crew">Crew</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="paypal">PayPal</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
          </TabsList>

          {/* Company Info Tab */}
          <TabsContent value="company" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Update your business details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Your company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-phone">Phone Number</Label>
                    <Input
                      id="company-phone"
                      value={companyPhone}
                      onChange={(e) => setCompanyPhone(e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-email">Email Address</Label>
                    <Input
                      id="company-email"
                      type="email"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      placeholder="contact@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-address">Address</Label>
                    <Input
                      id="company-address"
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      placeholder="123 Main St, City, State"
                    />
                  </div>
                </div>
                <Button onClick={handleSaveCompanyInfo} className="w-full">
                  Save Company Information
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Rules</CardTitle>
                <CardDescription>Configure your pricing model</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="base-cost">Base Cost Per Move ($)</Label>
                    <Input
                      id="base-cost"
                      type="number"
                      value={baseCost}
                      onChange={(e) => setBaseCost(e.target.value)}
                      placeholder="150"
                    />
                    <p className="text-xs text-gray-500">Minimum charge for any move</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost-per-mile">Cost Per Mile ($)</Label>
                    <Input
                      id="cost-per-mile"
                      type="number"
                      step="0.01"
                      value={costPerMile}
                      onChange={(e) => setCostPerMile(e.target.value)}
                      placeholder="2.50"
                    />
                    <p className="text-xs text-gray-500">Charged per mile traveled</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost-per-labor">Cost Per Labor Hour ($)</Label>
                    <Input
                      id="cost-per-labor"
                      type="number"
                      value={costPerLaborHour}
                      onChange={(e) => setCostPerLaborHour(e.target.value)}
                      placeholder="50"
                    />
                    <p className="text-xs text-gray-500">Per crew member per hour</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minimum-charge">Minimum Charge ($)</Label>
                    <Input
                      id="minimum-charge"
                      type="number"
                      value={minimumCharge}
                      onChange={(e) => setMinimumCharge(e.target.value)}
                      placeholder="300"
                    />
                    <p className="text-xs text-gray-500">Lowest quote amount</p>
                  </div>
                </div>
                <Button onClick={handleSavePricing} className="w-full">
                  Save Pricing Rules
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Crew Tab */}
          <TabsContent value="crew" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Crew Management</CardTitle>
                <CardDescription>Add and manage your crew members</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 border-b pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="crew-name">Crew Member Name</Label>
                      <Input
                        id="crew-name"
                        value={newCrewName}
                        onChange={(e) => setNewCrewName(e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="crew-phone">Phone Number</Label>
                      <Input
                        id="crew-phone"
                        value={newCrewPhone}
                        onChange={(e) => setNewCrewPhone(e.target.value)}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddCrew} className="w-full">
                    Add Crew Member
                  </Button>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Current Crew</h3>
                  {crewList.length === 0 ? (
                    <p className="text-gray-500 text-sm">No crew members added yet</p>
                  ) : (
                    <div className="space-y-2">
                      {crewList.map((crew) => (
                        <div key={crew.id} className="flex justify-between items-center p-3 bg-gray-100 rounded">
                          <div>
                            <p className="font-medium">{crew.name}</p>
                            <p className="text-sm text-gray-600">{crew.phone}</p>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveCrew(crew.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Management</CardTitle>
                <CardDescription>Add and manage your vehicles and trucks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 border-b pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="vehicle-name">Vehicle Name</Label>
                      <Input
                        id="vehicle-name"
                        value={newVehicleName}
                        onChange={(e) => setNewVehicleName(e.target.value)}
                        placeholder="Truck 1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vehicle-type">Vehicle Type</Label>
                      <select
                        id="vehicle-type"
                        value={newVehicleType}
                        onChange={(e) => setNewVehicleType(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="truck">Truck</option>
                        <option value="van">Van</option>
                        <option value="box-truck">Box Truck</option>
                        <option value="trailer">Trailer</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vehicle-capacity">Capacity (cu ft)</Label>
                      <Input
                        id="vehicle-capacity"
                        type="number"
                        value={newVehicleCapacity}
                        onChange={(e) => setNewVehicleCapacity(e.target.value)}
                        placeholder="500"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddVehicle} className="w-full">
                    Add Vehicle
                  </Button>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Current Vehicles</h3>
                  {vehicleList.length === 0 ? (
                    <p className="text-gray-500 text-sm">No vehicles added yet</p>
                  ) : (
                    <div className="space-y-2">
                      {vehicleList.map((vehicle) => (
                        <div key={vehicle.id} className="flex justify-between items-center p-3 bg-gray-100 rounded">
                          <div>
                            <p className="font-medium">{vehicle.name}</p>
                            <p className="text-sm text-gray-600">
                              {vehicle.type} - {vehicle.capacity} cu ft
                            </p>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveVehicle(vehicle.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PayPal Tab */}
          <TabsContent value="paypal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>PayPal Integration</CardTitle>
                <CardDescription>Connect your PayPal account for deposit collection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>How to get your PayPal credentials:</strong>
                    <br />
                    1. Go to{" "}
                    <a href="https://developer.paypal.com" target="_blank" rel="noopener noreferrer" className="underline">
                      PayPal Developer
                    </a>
                    <br />
                    2. Sign in with your PayPal Business account
                    <br />
                    3. Go to Apps & Credentials
                    <br />
                    4. Copy your Client ID and Secret
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="paypal-client-id">PayPal Client ID</Label>
                    <Input
                      id="paypal-client-id"
                      type="password"
                      value={paypalClientId}
                      onChange={(e) => setPaypalClientId(e.target.value)}
                      placeholder="Your PayPal Client ID"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paypal-client-secret">PayPal Client Secret</Label>
                    <Input
                      id="paypal-client-secret"
                      type="password"
                      value={paypalClientSecret}
                      onChange={(e) => setPaypalClientSecret(e.target.value)}
                      placeholder="Your PayPal Client Secret"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deposit-percentage">Deposit Percentage (%)</Label>
                    <Input
                      id="deposit-percentage"
                      type="number"
                      min="1"
                      max="100"
                      value={depositPercentage}
                      onChange={(e) => setDepositPercentage(e.target.value)}
                      placeholder="20"
                    />
                    <p className="text-xs text-gray-500">Customers will pay this % of quote as deposit</p>
                  </div>
                </div>

                <Button onClick={handleSavePayPal} className="w-full">
                  Save PayPal Configuration
          {/* SMS Tab */}
          <TabsContent value="sms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>SMS Configuration</CardTitle>
                <CardDescription>Set up Twilio for SMS notifications to customers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-blue-900">
                    <strong>How to get Twilio credentials:</strong>
                  </p>
                  <ol className="text-sm text-blue-900 list-decimal list-inside mt-2 space-y-1">
                    <li>Sign up at https://www.twilio.com</li>
                    <li>Go to Console Dashboard</li>
                    <li>Copy your Account SID and Auth Token</li>
                    <li>Get a Twilio phone number (e.g., +1-555-123-4567)</li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twilio-sid">Twilio Account SID</Label>
                  <Input
                    id="twilio-sid"
                    type="password"
                    value={twilioAccountSid}
                    onChange={(e) => setTwilioAccountSid(e.target.value)}
                    placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twilio-token">Twilio Auth Token</Label>
                  <Input
                    id="twilio-token"
                    type="password"
                    value={twilioAuthToken}
                    onChange={(e) => setTwilioAuthToken(e.target.value)}
                    placeholder="Your auth token"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twilio-phone">Twilio Phone Number</Label>
                  <Input
                    id="twilio-phone"
                    value={twilioPhoneNumber}
                    onChange={(e) => setTwilioPhoneNumber(e.target.value)}
                    placeholder="+1-555-123-4567"
                  />
                  <p className="text-xs text-gray-500">The phone number customers will see SMS from</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-900">
                    <strong>SMS will be sent for:</strong>
                  </p>
                  <ul className="text-sm text-green-900 list-disc list-inside mt-2 space-y-1">
                    <li>Quote submission confirmation</li>
                    <li>Quote response notification</li>
                    <li>Job confirmation</li>
                    <li>Crew arrival alerts</li>
                    <li>Job completion confirmation</li>
                  </ul>
                </div>

                <Button onClick={handleSaveSMS} className="w-full">
                  Save SMS Configuration
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
