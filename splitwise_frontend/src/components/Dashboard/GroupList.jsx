import { useState } from 'react';
import { useQuery } from 'react-query';
import api from '../../utils/api';
import GroupCard from './GroupCard';
import Pagination from '../common/Pagination';
import '../../styles/Dashboard.css';

const ITEMS_PER_PAGE = 6;

const GroupList = () => {
  const [page, setPage] = useState(1);
  
  const { data, isLoading } = useQuery(
    ['groups', page],
    () => api.get(`/groups?page=${page}&limit=${ITEMS_PER_PAGE}`),
    { keepPreviousData: true }
  );

  if (isLoading) return <div className="loading">Loading groups...</div>;

  return (
    <div className="group-list">
      <div className="group-grid">
        {data?.data.groups.map(group => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
      <Pagination
        currentPage={page}
        totalPages={Math.ceil(data?.data.total / ITEMS_PER_PAGE)}
        onPageChange={setPage}
      />
    </div>
  );
};

export default GroupList;