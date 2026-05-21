package com.nicholas.freelacashflow.security;

import java.util.Collection;
import java.util.List;

import com.nicholas.freelacashflow.user.document.UserDocument;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class AuthenticatedUser implements UserDetails {

    private final UserDocument user;

    public AuthenticatedUser(UserDocument user) {
        this.user = user;
    }

    public String getId() {
        return user.getId();
    }

    public String getName() {
        return user.getName();
    }

    public String getEmail() {
        return user.getEmail();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }
}
