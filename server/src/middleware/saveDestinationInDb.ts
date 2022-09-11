import { NextFunction, Request, Response } from "express";
import { errorHandle } from "../helpers/errorHandle";
import { Destinations } from "../models/Destination";
import { Collection } from "../models/enums";
import { DestinationTransitType } from "../models/types";
import { getCollection } from "../mongoDB/utils/getCollection";

// from callWikiApi


export const saveDestinationInDb = async (req: Request, res: Response, next: NextFunction) => {
   const callWiki = res.locals.callWiki;
   if(!callWiki) return;
  
    const { name, content, coordinates, images } = { ...res.locals.destination } as DestinationTransitType;      

    console.log("res.locals.destination in last", res.locals.destination);
    
    const destsColl = await getCollection(Collection.WikiDestinations);
    const destinationSaved = await destsColl.insertOne(res.locals.destination).catch(err => errorHandle(err, 500)); 

    if(!coordinates){
      res.status(200).json({
         destination: {
            name,
            content,
         },
      });
    }
    else if(coordinates.lat || coordinates.lng){  
       res.status(200).json({
         destination: {
            name,
            content,
            coordinates
         },
      });
   }

    

}