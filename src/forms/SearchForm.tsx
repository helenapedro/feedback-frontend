import React, { useState } from 'react';
import * as style from 'react-bootstrap/';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

interface SearchFormProps {
  onSearch: (format: string, createdAt: string) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDate, setSearchDate] = useState('');

  const handleSearch = () => {
    onSearch(searchQuery, searchDate);
  };

  return (
     <style.Form className="d-flex" onSubmit={(e) => e.preventDefault()}>
          <style.Form.Control
               type="text"
               placeholder="Search by format"
               className="me-2"
               aria-label="Search by format"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
          />
          <style.Form.Control
               type="date"
               placeholder="Search by date"
               className="me-2"
               aria-label="Search by date"
               value={searchDate}
               onChange={(e) => setSearchDate(e.target.value)}
          />
          <style.Button variant="outline-light" onClick={handleSearch} style={{ color: '#007acc' }}>
               <FontAwesomeIcon icon={faBars} /> Search
          </style.Button>
     </style.Form>
  );
};

export default SearchForm;
