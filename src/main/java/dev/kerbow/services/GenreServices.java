package dev.kerbow.services;

import java.util.ArrayList;
import java.util.List;

import dev.kerbow.models.Genre;
import dev.kerbow.repositories.GenreRepo;

public class GenreServices {
	private static GenreServices instance;
	private GenreRepo repo = new GenreRepo();
	
	private GenreServices() {}
	
	public static GenreServices getInstance() {
		if (instance == null) instance = new GenreServices();
		return instance;
	}
	
	public List<Genre> getAllList() {
		return new ArrayList<Genre>(this.repo.getAll().values());
	}
	
	public Genre getByName(String name) {
		return this.repo.getByName(name);
	}

	public Genre getGenreForGeneralEditor(Genre g) {
		switch (g.getName()) {
			case "fantasy": return this.getByName("fantasy");
			case "science-fiction": return this.getByName("science-fiction");
			case "mystery": return this.getByName("mystery");
			default: return g;
		}
	}

}
