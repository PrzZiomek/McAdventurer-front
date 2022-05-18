import { call, CallEffect, put, PutEffect } from "redux-saga/effects";
import { startLocationAction, locationAction } from "../../../state/actions/currentLocationAction";
import { coordinates, fetchCoordinates } from "../../data";

type OutgoingValue = CallEffect<typeof coordinates> | PutEffect<{type: string; payload: object;}>


export function* getCoordinatesMocked(): Generator<OutgoingValue, void, typeof coordinates> {

  try{
    const coordinates = yield call(fetchCoordinates); 
    yield put(locationAction(coordinates))
  }
  catch(err){
      console.log("error when getting user geolocation: ", err);     
  } 
}


