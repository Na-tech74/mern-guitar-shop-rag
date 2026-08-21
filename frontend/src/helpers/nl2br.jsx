import { Fragment } from "react";

export const nl2br = (text) => {
    if (typeof text !== "string") return text;
    return text.split("\n").map((line, i, arr) => (
        <Fragment key={i}>
            {line}
            {i < arr.length - 1 && <br />}
        </Fragment>
    ));
};
