import React, { Dispatch, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";

import { SearchMapStyled } from "./styles/SearchMapStyles";
import { WorldMap } from "../worldMap/WorldMap";
import { ActionErrObj, ErrorsCollection, Store } from "../../state/types";
import { startFetchDestListAction } from "../../state/actions/fetchDestinationActions";
import { ErrorModal } from "./components/errorModal/errorModal";
import { DestinationNameAndPos, WikiDestination } from "../../generalTypes/apiResponse";
import { StoreProps } from "../../enums";
import { startLocationAction } from "../../state/actions/currentLocationAction";
import { errorMonitAction } from "../../state/actions/errorActions";
import { determineCoords } from "./helpers/determineCoords";
import { errorCollector } from "../../utils/errorCollector";
import { MapUtils } from "../mapUtils/MapUtils";


export const SearchMap: React.FC = () => {

    const storeItemsNames = [StoreProps.GetErrors, StoreProps.GetDestinationList, StoreProps.GetDestination];

    const dispatch: Dispatch<ActionErrObj> = useDispatch();

    useEffect(() => { 
        dispatch(startFetchDestListAction());
    }, [dispatch])

    const errors: ErrorsCollection = useSelector((store: Store) => { 
        return storeItemsNames.reduce(errorCollector(store), []) 
     });

    useEffect(() => { 
        dispatch(errorMonitAction(errors));
    }, [errors.length])

    
    const destinationList: DestinationNameAndPos[] | undefined = useSelector((state: Store) => { 
        if(state.getDestinationList.loading !== false) return;
        return state.getDestinationList.destinations;                                   
    });

    const errorInformation = (): JSX.Element | null => {
        let Information: JSX.Element | null = null; 
        if(!errors) return null;

        const isError: boolean = errors.some(obj => obj.isError);   

        if(isError){      
            Information = <ErrorModal />        
        }; 

        return Information;
    }

    const destList: DestinationNameAndPos[] = destinationList?.length ? destinationList : []; 
 
    return  ( 

            <SearchMapStyled id="mapWrapper">   

                {errorInformation()}  

                <MapUtils destinations={destList} /> 

                <WorldMap
                    destinations={destList}
                />      

            </SearchMapStyled>  
     )
}