/**
 * CREATE A LINK: a Server Component card around the interactive form.
 * Only the form ships JavaScript; the card's markup is plain HTML.
 */
import { CreateLinkForm } from "@/components/dashboard/create-link-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function CreateLinkCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create a short link</CardTitle>
                <CardDescription>Paste a long URL; pick your own code if you like.</CardDescription>
            </CardHeader>
            <CardContent>
                <CreateLinkForm />
            </CardContent>
        </Card>
    );
}
