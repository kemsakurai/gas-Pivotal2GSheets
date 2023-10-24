import { getReleases } from "./functions/getReleases";
import { initialize } from "./functions/initialize";
import { setProperties } from "./functions/setProperties";
import { getPTStories } from "./functions/getPTStories";
import { onOpen } from "./functions/onOpen";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare let global: any;
global.onOpen = onOpen;
global.getPTStories = getPTStories;
global.getReleases = getReleases;
global.setValues = setProperties;
global.initialize = initialize;
