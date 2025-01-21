import React from 'react';
import "../DeleteModal/DeleteModal.css";

const DeleteModal = () => {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow  = () => setShow(true);
  return (
    <>
      <Modal show={showModal} onHide={handleClose} >
        <Modal.Header className='border-0'>
          <img src={Successimage} alt='successimage' className='success-img' />
        </Modal.Header>
        <Modal.Body >
          <h5>Confirm Delete</h5>
          <p>Are you sure want to delete this account.</p>
        </Modal.Body>
        <Modal.Footer className='border-0'>
          <div>
            <button>Cancel</button>
            <button>Delete</button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default DeleteModal;