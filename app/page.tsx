import { redirect } from 'next/navigation';

// CodeSprint 11 is the only storefront — the root always routes there.
export default function Home() {
    redirect('/codesprint');
}
