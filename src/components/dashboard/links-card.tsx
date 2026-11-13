/** LINKS: stored links, newest first, from GET /api/v1/links. */
import { LinksTable } from "@/components/links/links-table";
import { RefreshLinksButton } from "@/components/links/refresh-links-button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export function LinksCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Links</CardTitle>
                <CardDescription>Stored in MongoDB, newest first.</CardDescription>
                <CardAction>
                    <RefreshLinksButton />
                </CardAction>
            </CardHeader>
            <CardContent>
                <LinksTable />
            </CardContent>
        </Card>
    );
}
