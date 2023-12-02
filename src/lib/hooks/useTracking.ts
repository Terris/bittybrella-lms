"use client";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useMe } from "../providers";

export function useTracking() {
  const { me } = useMe();
  const trackMutation = useMutation(api.tracking.track);

  const trackEvent = async ({
    event,
    originatedFrom,
    metaData,
  }: {
    event: string;
    originatedFrom: string;
    metaData?: any;
  }) => {
    if (!me) {
      return;
    }

    // all lowercase to normalize the data
    trackMutation({
      userId: me.id,
      event: event.toLocaleLowerCase(),
      originatedFrom: originatedFrom.toLocaleLowerCase(),
      metaData,
    });
  };

  return { trackEvent };
}
