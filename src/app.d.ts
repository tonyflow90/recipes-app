// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { TypedSupabaseClient } from "@supabase/auth-helpers-sveltekit";

// and what to do when importing types
declare namespace App {
	// interface Error {}
	interface Locals {
		supabaseClient: TypedSupabaseClient
		session: Session | null
	}
	interface PageData {
		session: Session | null
	}
	// interface Platform {}
}
