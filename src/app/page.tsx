/**
 * THE DASHBOARD (route `/`): stats, the create form, the links list and the
 * live request log. A Server Component that only arranges the panels; each
 * panel owns its own data and, when interactive, is a client component.
 */
import { GaugeIcon, LinkIcon } from "lucide-react";
import { CreateLinkCard } from "@/components/dashboard/create-link-card";
import { LinksCard } from "@/components/dashboard/links-card";
import { RequestLogCard } from "@/components/dashboard/request-log-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { HealthProvider } from "@/components/health/health-provider";
import { HealthStatCard } from "@/components/health/health-stat-card";
import { SiteHeader } from "@/components/site-header";

export default function DashboardPage() {
    return (
        // One health poll, shared by the header pill and the status card.
        <HealthProvider>
            <SiteHeader />

            <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-8 sm:px-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
                    <p className="text-sm text-muted-foreground">
                        Create and browse short links, and watch the API handle each request.
                    </p>
                </div>

                <section aria-label="Key numbers" className="grid gap-4 sm:grid-cols-3">
                    <HealthStatCard />
                    <StatCard
                        icon={LinkIcon}
                        label="Short links"
                        value={<span className="text-muted-foreground">—</span>}
                        hint="Stored in MongoDB"
                    />
                    <StatCard
                        icon={GaugeIcon}
                        label="Requests / min"
                        value={<span className="text-muted-foreground">—</span>}
                        hint="From the live request log"
                    />
                </section>

                <div className="grid gap-6 lg:grid-cols-5">
                    <div className="lg:col-span-2">
                        <CreateLinkCard />
                    </div>
                    <div className="lg:col-span-3">
                        <LinksCard />
                    </div>
                </div>

                <RequestLogCard />
            </main>
        </HealthProvider>
    );
}
