/**
 * LIVE REQUEST LOG: every request the API handles, streamed with
 * Server-Sent Events from its dev-only endpoint (DEV_TOOLS=true).
 */
import { RequestLogPanel, RequestLogStatus } from "@/components/request-log/request-log-panel";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export function RequestLogCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Live request log</CardTitle>
                <CardDescription>Every request the API handles, as it happens.</CardDescription>
                <CardAction>
                    <RequestLogStatus />
                </CardAction>
            </CardHeader>
            <CardContent>
                <RequestLogPanel />
            </CardContent>
        </Card>
    );
}
