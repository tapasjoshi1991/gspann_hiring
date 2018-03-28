package com.gspann.hiring.bean;

import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.gspann.hiring.bean.JsonDateSerializer;

/**
 * 
 * @author Tapas Ranjan Joshi
 *
 */

@Entity
public class Candidate {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long candidateId;
	private String name;
	private String organization;
	private String role;
	private String experience;
	@Lob
	private byte[] resume;
	private String resumeName;
	private String ifs;
	private Date creationDate;
	private String candidateStatus;
	private int interviewLevel;
	private String lastInterviewedBy = "na";
	
	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JoinColumn(name = "candidateId")
	private List<InterviewStatus> interviewStatusList;
	
	public long getCandidateId() {
		return candidateId;
	}
	public void setCandidateId(long candidateId) {
		this.candidateId = candidateId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getOrganization() {
		return organization;
	}
	public void setOrganization(String organization) {
		this.organization = organization;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public String getExperience() {
		return experience;
	}
	public void setExperience(String experience) {
		this.experience = experience;
	}
	public byte[] getResume() {
		return resume;
	}
	public void setResume(byte[] resume) {
		this.resume = resume;
	}
	public String getIfs() {
		return ifs;
	}
	public void setIfs(String ifs) {
		this.ifs = ifs;
	}
	@JsonSerialize(using=JsonDateSerializer.class)
	public Date getCreationDate() {
		return creationDate;
	}
	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}
	public String getCandidateStatus() {
		return candidateStatus;
	}
	public void setCandidateStatus(String candidateStatus) {
		this.candidateStatus = candidateStatus;
	}
	public int getInterviewLevel() {
		return interviewLevel;
	}
	public void setInterviewLevel(int interviewLevel) {
		this.interviewLevel = interviewLevel;
	}
	public String getLastInterviewedBy() {
		return lastInterviewedBy;
	}
	public void setLastInterviewedBy(String lastInterviewedBy) {
		this.lastInterviewedBy = lastInterviewedBy;
	}
	public List<InterviewStatus> getInterviewStatusList() {
		return interviewStatusList;
	}
	public void setInterviewStatusList(
			List<InterviewStatus> interviewStatusList) {
		this.interviewStatusList = interviewStatusList;
	}
	
	public String getResumeName() {
		return resumeName;
	}
	public void setResumeName(String resumeName) {
		this.resumeName = resumeName;
	}
	@Override
	public String toString() {
		// TODO Auto-generated method stub
		return "[name : "+this.getName()+", organization : "+this.getOrganization()+", role : "+this.getRole()+"]";
	}
	@Override
	public boolean equals(Object obj) {
		// TODO Auto-generated method stub
		return super.equals(obj);
	}
	
	
	
	
	
	
	

}
