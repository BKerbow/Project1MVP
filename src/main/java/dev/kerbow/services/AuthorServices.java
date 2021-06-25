package dev.kerbow.services;

import dev.kerbow.models.Author;
import dev.kerbow.repositories.AuthorRepo;

public class AuthorServices {
	private static AuthorServices instance;
	private AuthorRepo repo = new AuthorRepo();
	
	private AuthorServices() {}
	
	public static AuthorServices getInstance() {
		if (instance == null) instance = new AuthorServices();
		return instance;
	}
	
	public Author addAuthor(Author a) {
		return this.repo.add(a);
	}
	
	public Author getByUsernameAndPassword(String username, String password) {
		return this.repo.getByUsernameAndPassword(username, password);
	}
	
	public void updateAuthor(Author a) {
		this.repo.update(a);
	}
	
	public void addPoints(Author a, int points) {
		a.setPoints(a.getPoints() + points);
		this.updateAuthor(a);
	}
	
	public void subtractPoints(Author a, int points) {
		a.setPoints(a.getPoints() - points);
		this.updateAuthor(a);
	}
	
	public boolean deleteAuthor(Author a) {
		return this.repo.delete(a);
	}
}
