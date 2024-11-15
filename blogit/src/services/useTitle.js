import React, { useState, useEffect } from "react";

export const useTitle = (title) => {
    const documentDefined = typeof document !== "undefined";
    const originalTitle = React.useRef(documentDefined ? document.title : null);

    React.useEffect(() => {
        if (!documentDefined) return;

        if (document.title !== title) document.title = title;

        return () => {
            document.title = originalTitle.current;
        };
    }, []);
};
