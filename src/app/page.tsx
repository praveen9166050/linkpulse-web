/**
 * THE DASHBOARD (route `/`): stats, the create form, the links list and the
 * live request log. A Server Component that only arranges the panels; each
 * panel owns its own data and, when interactive, is a client component.
 */
import { LinkIcon } from "lucide-react";
import { CreateLinkCard } from "@/components/dashboard/create-link-card";
import { LinksCard } from "@/components/dashboard/links-card";
import { RequestLogCard } from "@/components/dashboard/request-log-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { HealthProvider } from "@/components/health/health-provider";
import { HealthStatCard } from "@/components/health/health-stat-card";
import { LinksProvider } from "@/components/links/links-provider";
import { RequestLogProvider } from "@/components/request-log/request-log-provider";
import { RequestsPerMinuteCard } from "@/components/request-log/requests-per-minute-card";
import { SiteHeader } from "@/components/site-header";

export default function DashboardPage() {
    return (
        // One health poll (header pill + status card) and one request stream
        // (log panel + requests/min card), each shared by everything that shows it.
        <HealthProvider>
            <RequestLogProvider>
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
                        <RequestsPerMinuteCard />
                    </section>

                    {/* One links list, shared: the form adds to it, the table shows it. */}
                    <LinksProvider>
                        <div className="grid gap-6 lg:grid-cols-5">
                            <div className="lg:col-span-2">
                                <CreateLinkCard />
                            </div>
                            <div className="lg:col-span-3">
                                <LinksCard />
                            </div>
                        </div>
                    </LinksProvider>

                    <RequestLogCard />
                </main>
            </RequestLogProvider>
        </HealthProvider>
    );
}
