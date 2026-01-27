import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Truck, DollarSign, FileText } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // Redirect non-admin users
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch data
  const leadsQuery = trpc.lead.list.useQuery({ status: "new" });
  const jobsQuery = trpc.job.list.useQuery({ status: "scheduled" });
  const crewQuery = trpc.crew.list.useQuery();
  const vehiclesQuery = trpc.vehicle.list.useQuery();

  if (!user || user.role !== "admin") {
    return <div className="p-6">Unauthorized</div>;
  }

  const pendingLeads = leadsQuery.data?.length || 0;
  const scheduledJobs = jobsQuery.data?.length || 0;
  const activeCrew = crewQuery.data?.length || 0;
  const activeVehicles = vehiclesQuery.data?.length || 0;

  const crewUtilization = activeCrew > 0 ? Math.round((scheduledJobs / activeCrew) * 100) : 0;
  const conversionRate = pendingLeads > 0 ? Math.round((scheduledJobs / (pendingLeads + scheduledJobs)) * 100) : 0;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}. Here's your business overview.</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Pending Quotes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{pendingLeads}</div>
              <p className="text-xs text-muted-foreground mt-2">New leads awaiting quotes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Scheduled Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{scheduledJobs}</div>
              <p className="text-xs text-muted-foreground mt-2">Moving jobs booked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Active Crew
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{activeCrew}</div>
              <p className="text-xs text-muted-foreground mt-2">Team members available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Active Vehicles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{activeVehicles}</div>
              <p className="text-xs text-muted-foreground mt-2">Trucks available</p>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Crew Utilization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{crewUtilization}%</div>
              <p className="text-xs text-muted-foreground mt-2">Jobs per crew member</p>
              <div className="w-full bg-secondary rounded-full h-2 mt-3">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(crewUtilization, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{conversionRate}%</div>
              <p className="text-xs text-muted-foreground mt-2">Quotes to bookings</p>
              <div className="w-full bg-secondary rounded-full h-2 mt-3">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(conversionRate, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for detailed views */}
        <Tabs defaultValue="leads" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="crew">Crew</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          </TabsList>

          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <CardTitle>Recent Leads</CardTitle>
                <CardDescription>Manage incoming quote requests</CardDescription>
              </CardHeader>
              <CardContent>
                {leadsQuery.isLoading ? (
                  <div className="text-center py-8">Loading leads...</div>
                ) : leadsQuery.data && leadsQuery.data.length > 0 ? (
                  <div className="space-y-4">
                    {leadsQuery.data.slice(0, 5).map((lead) => (
                      <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{lead.customerName}</p>
                          <p className="text-sm text-muted-foreground">{lead.customerPhone}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No pending leads</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Jobs</CardTitle>
                <CardDescription>Upcoming moving assignments</CardDescription>
              </CardHeader>
              <CardContent>
                {jobsQuery.isLoading ? (
                  <div className="text-center py-8">Loading jobs...</div>
                ) : jobsQuery.data && jobsQuery.data.length > 0 ? (
                  <div className="space-y-4">
                    {jobsQuery.data.slice(0, 5).map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{job.customerName}</p>
                          <p className="text-sm text-muted-foreground">
                            {job.moveDate ? new Date(job.moveDate).toLocaleDateString() : "TBD"}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No scheduled jobs</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="crew">
            <Card>
              <CardHeader>
                <CardTitle>Active Crew</CardTitle>
                <CardDescription>Team members and availability</CardDescription>
              </CardHeader>
              <CardContent>
                {crewQuery.isLoading ? (
                  <div className="text-center py-8">Loading crew...</div>
                ) : crewQuery.data && crewQuery.data.length > 0 ? (
                  <div className="space-y-4">
                    {crewQuery.data.slice(0, 5).map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.phone}</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          {member.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No crew members</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vehicles">
            <Card>
              <CardHeader>
                <CardTitle>Active Vehicles</CardTitle>
                <CardDescription>Fleet status and availability</CardDescription>
              </CardHeader>
              <CardContent>
                {vehiclesQuery.isLoading ? (
                  <div className="text-center py-8">Loading vehicles...</div>
                ) : vehiclesQuery.data && vehiclesQuery.data.length > 0 ? (
                  <div className="space-y-4">
                    {vehiclesQuery.data.slice(0, 5).map((vehicle) => (
                      <div key={vehicle.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{vehicle.name}</p>
                          <p className="text-sm text-muted-foreground">{vehicle.licensePlate}</p>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {vehicle.type}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No vehicles</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
