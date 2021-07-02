package dev.kerbow.services;

import java.util.List;

import dev.kerbow.models.Author;
import dev.kerbow.models.Editor;
import dev.kerbow.models.Genre;
import dev.kerbow.models.Story;
import dev.kerbow.repositories.StoryRepo;

public class StoryServices {
	private static StoryServices instance;
	private StoryRepo repo = new StoryRepo();
	
	private StoryServices() {}
	
	public static StoryServices getInstance() {
		if (instance == null) instance = new StoryServices();
		return instance;
	}
	
//	public Story parse(Gson gson, BufferedReader reader) throws IOException {
//		return gson.fromJson(reader, Story.class);
//	}
	
	public void submitNextWaitingProposal(Author a) {
		List<Story> waiting = this.getAllWaitingForAuthor(a);
		Story next = waiting.stream().filter((s) -> { return s.getType().getPoints() <= a.getPoints(); }).findAny().orElse(null);
		if (next != null) {
			this.incrementApprovalStatus(next, null);
			AuthorServices.getInstance().subtractPoints(a, next.getType().getPoints());
			this.updateStory(next);
		}
	}
	
	public Story addStory(Story s) {
		return this.repo.add(s);
	}
	
	public List<Story> getAllByAuthor(Integer a) {
		return this.repo.getAllByAuthor(a);
	}
	
	public List<Story> getByType(String type){
		return this.repo.getByType(type);
	}
	
	public List<Story> getAllByGenreAndStatus(Genre genre, String status) {
		return this.repo.getAllByGenreAndStatus(genre, status);
	}
	
	public List<Story> getAllByReceiverName(String firstName, String lastName) {
		return this.repo.getAllByReceiverName(firstName, lastName);
	}
	
	public List<Story> getAllWithDraftsForEditor(Editor e) {
			return this.repo.getAllWithDraftsForEditor(e);
	}
	
	public List<Story> getAllWaitingForAuthor(Author a) {
		return this.repo.getAllByAuthorAndStatus(a.getId(), "waiting");
	}
	
	public void updateStory(Story s) {
		this.repo.update(s);
	}
	
	public void incrementApprovalStatus(Story s, Editor e) {
		String status = s.getApprovalStatus();
		switch (status) {
			case "waiting":
				s.setApprovalStatus("submitted");
				break;
			case "submitted":
				s.setApprovalStatus("approved_assistant");
				s.setAssistant(e);
				break;
			case "approved_assistant":
				s.setApprovalStatus("approved_editor");
				s.setEditor(e);
				break;
			case "approved_editor":
				s.setApprovalStatus("approved_senior");
				s.setSenior(e);
				break;
			case "approved_senior":
				s.setApprovalStatus("draft_approved");
				break;
			default: break;
		}
		this.updateStory(s);
	}
	
	public boolean deleteStory(Story s) {
		AuthorServices.getInstance().addPoints(s.getAuthor(), s.getType().getPoints());
		return this.repo.delete(s);
	}
}