import { useCallback, useEffect, useState } from "react";

import { SupabaseClient } from "@supabase/supabase-js";

const downloadFromSupabase = async (
    bucket: string,
    name: string,
    filename: string,
    supabase: SupabaseClient,
    filetype: string | undefined = undefined,
  ) => {
    const { data, error } = await supabase.storage.from(bucket).download(name);
    if (error) {
      return { error: error };
    } if (!data) {
      return { error: { message: "No data" }};
    }
    return { file: new File([data as BlobPart], filename, { type: filetype || data.type }) }
  }

  export default downloadFromSupabase;