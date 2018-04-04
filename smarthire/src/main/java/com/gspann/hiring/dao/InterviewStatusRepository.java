package com.gspann.hiring.dao;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.gspann.hiring.bean.InterviewStatus;

@Repository
public interface InterviewStatusRepository extends CrudRepository<InterviewStatus, Integer> {
	
	public List<InterviewStatus> findInterviewStatusByCandidateId(long candidateId);

}
