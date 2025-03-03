import React, { useEffect } from 'react';
import { Form, Row, Col, Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { fetchResumeVersionsAsync } from '../redux/resumeSlice';
import { useAppDispatch } from '../redux/store';
import { IResume } from '../types';
import useResumeUpdate from '../middleware/useResumeUpdate';

interface OwnerDetailFormProps {
  resumeId: string;
  resume: IResume | null;
  initialDescription: string;
  onSuccess: () => void;
  isOwner: boolean;
}

const OwnerDetailForm: React.FC<OwnerDetailFormProps> = ({
  resumeId,
  resume,
  initialDescription = '',
  onSuccess,
  isOwner,
}) => {
  const dispatch = useAppDispatch();

  const {
    newDescription,
    setNewDescription,
    isEditing,
    handleDescriptionUpdate,
  } = useResumeUpdate(resumeId, initialDescription, onSuccess);

  useEffect(() => {
    if (resumeId) {
      dispatch(fetchResumeVersionsAsync(resumeId));
    }
  }, [dispatch, resumeId]);

  useEffect(() => {
    if (resume?.description) {
      setNewDescription(resume.description);
    }
  }, [resume, setNewDescription]);

  return (
    <Card className="mt-3">
      <Card.Body>
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>
                <FontAwesomeIcon icon={faUser} className="me-2" />
                Uploaded By
              </Form.Label>
              <Form.Control
                type="text"
                value={resume?.posterId.username || ''}
                disabled
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>
                <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                Uploaded At
              </Form.Label>
              <Form.Control
                type="text"
                value={resume ? new Date(resume.createdAt).toLocaleString() : ''}
                disabled
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>Description</Card.Title>
                {isOwner ? (
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    disabled={isEditing}
                  />
                ) : (
                  <Card.Text>
                    {resume?.description || 'No description available.'}
                  </Card.Text>
                  
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {isOwner && (
          <Row className="mt-3">
            <Col md={6}>
              <Button
                variant="warning"
                onClick={handleDescriptionUpdate}
                disabled={newDescription.trim() === resume?.description || isEditing}
                className='btn-block'
              >
                Update Description
              </Button>
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
};

export default OwnerDetailForm;