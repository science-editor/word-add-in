import React, { useEffect, useState } from "react";
import Chip from "@mui/material/Chip";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";

const DOI = ({ paper }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (paper.DOI) {
            setShow(true);
        }
    }, []);

    const openInNewTab = () => {
        window.open(`http://doi.org/${paper.DOI}`, "_blank", "noreferrer");
    };

    return show ? (
        <Chip
            icon={<LaunchOutlinedIcon />}
            label="DOI Link"
            size="small"
            variant="outlined"
            onClick={openInNewTab}
            sx={{
                fontSize: "10px",
                marginRight: "5px",
                padding: "10px",
            }}
        />
    ) : null;
};

export default DOI;