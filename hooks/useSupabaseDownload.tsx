import { useState, useEffect } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import useSupabase from "./useSupabase"

const useSupabaseDownload = (
    bucket: string,
    name: string,
    filename: string,
    filetype: string | undefined = undefined,
  ) => {
    const { supabase } = useSupabase();
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState<File | null>(null);
    useEffect(() => {
      const downloadFile = async () => {
        const { data, error: fetchError } = await supabase.storage.from(bucket).download(name);
          setLoading(false)
        if (fetchError) {
          setError(fetchError);
        } else if (!data) {
          setError(new Error("No data has been downloaded. Error 563."));
        } else {
          setFile(new File([data as BlobPart], filename, { type: filetype || data.type }))
        }
      }
      downloadFile();
    }, [supabase, bucket, name, filename, filetype])
    return { file, error, loading };
  }
  
  export default useSupabaseDownload;
