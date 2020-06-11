import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import './DiveTableActions.css';

import { DiveContext } from '../../shared/context/dive-context';

const DiveTableActions = (props) => {
  const dContext = useContext(DiveContext);
  const { dataid } = props;
  const deleteClickHandler = (e) => {
    dContext.deleteDive(dataid);
  };
  const updateSelectedDive = (e) => {
    dContext.selected = dContext.selectDive(dataid, dContext.dives);
  };

  return (
    <div className='dive-action-container'>
      <Link to={`/dives/view/${dataid}`}>
        <VisibilityIcon
          arial-label='view'
          id={`view`}
          data-action='view'
          className='dive-action-icon'
          fontSize='small'
          color='primary'
          onClick={updateSelectedDive}
          focusable={true}
        />
      </Link>
      <Link to={`/dives/edit/${dataid}`}>
        <EditIcon
          arial-label='edit'
          id={`edit`}
          data-action='edit'
          className='dive-action-icon'
          fontSize='small'
          color='action'
          onClick={updateSelectedDive}
          focusable={true}
        />
      </Link>
      <DeleteIcon
        arial-label='delete'
        id={`delete`}
        data-action='delete'
        className='dive-action-icon'
        fontSize='small'
        color='secondary'
        onClick={deleteClickHandler}
        focusable={true}
      />
    </div>
  );
};

export default DiveTableActions;
