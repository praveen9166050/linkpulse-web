/** LINKS: stored links, newest first, from GET /api/v1/links (added in step U3). */
import { LinkIcon, RefreshCwIcon } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const COLUMNS = ["Short link", "Destination", "Created"] as const;

export function LinksCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Links</CardTitle>
                <CardDescription>Stored in MongoDB, newest first.</CardDescription>
                <CardAction>
                    <Button variant="outline" size="sm" disabled>
                        <RefreshCwIcon data-icon="inline-start" />
                        Refresh
                    </Button>
                </CardAction>
            </CardHeader>

            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {COLUMNS.map((column) => (
                                <TableHead key={column}>{column}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={COLUMNS.length} className="p-0 pt-4">
                                <EmptyState icon={LinkIcon} title="No links to show yet">
                                    This list fills in once the API can list links (GET
                                    /api/v1/links).
                                </EmptyState>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
