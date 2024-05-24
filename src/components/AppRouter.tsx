import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { privateRoutes, publicRoutes } from '../router';
import { RootState } from '../store';
import { ConnectedProps, connect } from 'react-redux'
import { useEffect, useState } from 'react';

const GetDeviceType = () => {
    let details = navigator.userAgent;

    let regexp = /android|iphone|kindle|ipad/i;

    let isMobileDevice = regexp.test(details);

    if (isMobileDevice) {
        console.log("You are using a Mobile Device");
        return true
    } else {
        console.log("You are using Desktop");
        return false
    }
}

const mapState = (state: RootState) => (
    {

    }
)

type PropsFromRedux = ConnectedProps<typeof connector>

const connector = connect(mapState)

const AppRouter = (props: PropsFromRedux) => {
    const navigate = useNavigate()
    
    const [deviceType, setDeviceType] = useState<boolean>()

    useEffect(() => {
        (async () => {
            setDeviceType(GetDeviceType())
        })()
    }, [])

    useEffect(() => {
        if (deviceType) navigate('/startPlayer')
            else navigate('/startHost')
    }, [deviceType]);

    return (
        <Routes>
            {publicRoutes.map(route =>
                <Route
                    Component={route.element}
                    path={route.path}
                    key={route.path} />
            )}
            {privateRoutes.map(route =>
                <Route
                    Component={route.element}
                    path={route.path}
                    key={route.path} />
            )}
            <Route path="*" element={<Navigate to="/blank" replace/>}/>
        </Routes>
    )
}

export default connector(AppRouter)