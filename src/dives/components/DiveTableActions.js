import React, { useContext } from "react";
import { Link } from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
import "./DiveTableActions.css";

import { DiveContext } from "../../shared/context/dive-context";

import Swal from "sweetalert2";

const DiveTableActions = (props) => {
  const dContext = useContext(DiveContext);
  const { dataid } = props;

  const deleteClickHandler = (e) => {
    Swal.fire({
      title: "Are you sure?",
      text:
        "This action can't be undone. You're about to delete this dive from your logbook.",
      icon: "warning",
      confirmButtonText: "Yes, delete it!",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        dContext.deleteDive(dataid);
      }
    });
  };

  return (
    <div className="dive-action-container">
      <Link to={`/dives/${dataid}/view`}>
        <VisibilityIcon
          arial-label="view"
          id={`view`}
          data-action="view"
          className="dive-action-icon"
          fontSize="small"
          color="primary"
          focusable={true}
        />
      </Link>
      <Link to={`/dives/${dataid}/edit`}>
        <EditIcon
          arial-label="edit"
          id={`edit`}
          data-action="edit"
          className="dive-action-icon"
          fontSize="small"
          color="action"
          focusable={true}
        />
      </Link>
      <DeleteIcon
        arial-label="delete"
        id={`delete`}
        data-action="delete"
        className="dive-action-icon"
        fontSize="small"
        color="secondary"
        onClick={deleteClickHandler}
        focusable={true}
      />
    </div>
  );
};

export default DiveTableActions;
