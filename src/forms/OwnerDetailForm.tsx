import React, { useEffect } from 'react';
import { Form, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { fetchResumeVersionsAsync } from '../redux/resumeSlice';
import { useAppDispatch } from '../redux/store';
import { IResume } from '../types';

interface OwnerDetailFormProps {
  resumeId: string;
  resume: IResume | null;
}

const OwnerDetailForm: React.FC<OwnerDetailFormProps> = ({
  resumeId,
  resume,
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (resumeId) {
      dispatch(fetchResumeVersionsAsync(resumeId));
    }
  }, [dispatch, resumeId]);

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
                <Card.Text>
                  {resume?.description || 'No description available.'}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default OwnerDetailForm;