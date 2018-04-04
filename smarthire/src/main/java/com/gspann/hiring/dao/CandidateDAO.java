package com.gspann.hiring.dao;

import org.springframework.stereotype.Repository;

@Repository
public interface CandidateDAO {
	
	boolean updateResume(byte[] resume, String resumeName, long candidateId);

}
