import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server';

export default async function Notes() {
  const supabase = createClient();
  const { data: notes } = await supabase.from("notes").select();

  return (
    <div>

<pre>{JSON.stringify(notes, null, 2)}</pre>
  <Button>Button</Button>
    </div>
  )

}