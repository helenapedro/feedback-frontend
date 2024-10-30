import React from 'react';
import * as style from 'react-bootstrap/';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => (
  <style.Pagination className="mt-3" style={{ marginLeft: '12px' }}>
    {Array.from({ length: totalPages }, (_, index) => (
      <style.Pagination.Item
        key={index + 1}
        active={index + 1 === currentPage}
        onClick={() => onPageChange(index + 1)}
      >
        {index + 1}
      </style.Pagination.Item>
    ))}
  </style.Pagination>
);

export default Pagination;
