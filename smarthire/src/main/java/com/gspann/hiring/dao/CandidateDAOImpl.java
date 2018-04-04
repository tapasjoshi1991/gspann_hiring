package com.gspann.hiring.dao;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class CandidateDAOImpl implements CandidateDAO {

	@PersistenceContext
	private EntityManager em;
	
	@Override
	@Transactional
	public boolean updateResume(byte[] resume, String resumeName, long candidateId) {
		Query query = em.createQuery("update Candidate c set c.resume = :resume, c.resumeName = :resumeName where c.candidateId = :candidateId");
		query.setParameter("resume", resume);
		query.setParameter("candidateId", candidateId);
		query.setParameter("resumeName", resumeName);
		int count = query.executeUpdate();
		if(count > 0)
			return true;
		else
			return false;
	} 

}
