// /services/uploads/fetchUserUploads.ts
import { supabase } from ..//supabaseClient';

export async function fetchUserUploadedFilesWithContext(userId: string) {
  const { data, error } = await supabase
    .from('user_uploaded_file_context')
    .select('*')
    .eq('user_id', userId)
    .order('file_uploaded_at', { ascending: false });

  if (error) {
    console.error('Error fetching uploaded file context:', error);
    return [];
  }

  return data;
}
