import { useAuthContext, Hooks } from "@asgardeo/auth-react";
import React, { useCallback, useEffect, useState } from "react";
import { default as authConfig } from "../config.json";
import Layout  from "../layouts/Layout";
import { useLocation } from "react-router-dom";

const Home = () => {
    const {
        state,
        signIn,
        signOut,
        getBasicUserInfo,
        getIDToken,
        getDecodedIDToken,
        on
    } = useAuthContext();

    const [derivedAuthenticationState, setDerivedAuthenticationState] = useState(null);
    const [hasAuthenticationErrors, setHasAuthenticationErrors] = useState(false);
    const [hasLogoutFailureError, setHasLogoutFailureError] = useState();

    const search = useLocation().search;
    const stateParam = new URLSearchParams(search).get('state');
    const errorDescParam = new URLSearchParams(search).get('error_description');

    useEffect(() => {
        if (!state?.isAuthenticated) {
            return;
        }

        (async () => {
            const basicUserInfo = await getBasicUserInfo();
            const idToken = await getIDToken();
            const decodedIDToken = await getDecodedIDToken();

            const derivedState = {
                authenticateResponse: basicUserInfo,
                idToken: idToken.split("."),
                decodedIdTokenHeader: JSON.parse(atob(idToken.split(".")[0])),
                decodedIDTokenPayload: decodedIDToken
            };

            setDerivedAuthenticationState(derivedState);
        })();
    }, [state.isAuthenticated, getBasicUserInfo, getIDToken, getDecodedIDToken]);

    useEffect(() => {
        if (stateParam && errorDescParam) {
            if (errorDescParam === "End User denied the logout request") {
                setHasLogoutFailureError(true);
            }
        }
    }, [stateParam, errorDescParam]);

    const handleLogin = useCallback(() => {
        setHasLogoutFailureError(false);
        signIn().catch(() => setHasAuthenticationErrors(true));
    }, [signIn]);

    useEffect(() => {
        on(Hooks.SignOut, () => {
            setHasLogoutFailureError(false);
        });

        on(Hooks.SignOutFailed, () => {
            if (!errorDescParam) {
                handleLogin();
            }
        });
    }, [on, handleLogin, errorDescParam]);

    const handleLogout = () => {
        signOut();
    };

    if (!authConfig?.clientID) {
        return (
            <div className="content">
                {/* UI warning if clientID is missing */}
            </div>
        );
    }

    return (
        <Layout
            isLoading={state.isLoading || state.isAuthenticated === undefined}
            hasErrors={hasAuthenticationErrors}
        >
            {
                state.isAuthenticated
                    ? (
                        <div className="content">
                            <button
                                className="btn primary mt-4"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    )
                    : (
                        <div className="content">
                            <button
                                className="btn primary"
                                onClick={handleLogin}
                            >
                                Login
                            </button>
                        </div>
                    )
            }
        </Layout>
    );
};

export default Home;
