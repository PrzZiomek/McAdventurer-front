import React, { Dispatch, ExoticComponent, FC, LazyExoticComponent, PropsWithChildren, ReactElement, Suspense, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";

import { SearchMapStyled } from "./styles/SearchMapStyles";
import { ActionErrObj, ErrorsCollection, Store } from "../../state/types";
import { startFetchDestListAction } from "../../state/actions/fetchDestinationActions";
import { ErrorModal } from "./components/errorModal/errorModal";
import { StoreProps } from "../../enums";
import { errorMonitAction } from "../../state/actions/errorActions";
import { errorCollector } from "../../utils/errorCollector";
import { MapUtils } from "../mapUtils/MapUtils";
import { Destination } from "../../generalTypes/apiResponse";
import { I } from "../worldMap/models/types/componentsInterfaces";
import world from "../worldMap/WorldMap";

const WorldMap: LazyExoticComponent<FC<I.WorldMap>> = React.lazy(() => import("../worldMap/WorldMap"));

const LazyWorldMap = (props: PropsWithChildren<I.WorldMap>) => (
    <Suspense fallback={ <div>Loading the map...</div> }>
        <WorldMap {...props}/>
    </Suspense>
)


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
    
    const destinationList: Destination[] | undefined = useSelector((state: Store) => { console.log("state.getDestinationList", state.getDestinationList);
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

    const destList: Destination[] = destinationList?.length ? destinationList : [];  
    
    return  ( 

            <SearchMapStyled id="mapWrapper">   

                {errorInformation()}  

                <MapUtils destinations={destList} /> 

                <LazyWorldMap
                    destinations={destList}
                /> 

            </SearchMapStyled>  
     )
}
