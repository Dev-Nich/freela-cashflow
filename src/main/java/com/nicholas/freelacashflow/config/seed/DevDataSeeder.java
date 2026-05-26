package com.nicholas.freelacashflow.config.seed;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.nicholas.freelacashflow.category.document.CategoryDocument;
import com.nicholas.freelacashflow.category.repository.CategoryRepository;
import com.nicholas.freelacashflow.expense.document.ExpenseDocument;
import com.nicholas.freelacashflow.expense.enums.ExpenseStatus;
import com.nicholas.freelacashflow.expense.repository.ExpenseRepository;
import com.nicholas.freelacashflow.income.document.IncomeDocument;
import com.nicholas.freelacashflow.income.enums.IncomeStatus;
import com.nicholas.freelacashflow.income.repository.IncomeRepository;
import com.nicholas.freelacashflow.user.document.UserDocument;
import com.nicholas.freelacashflow.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@Profile("dev")
@RequiredArgsConstructor
public class DevDataSeeder implements CommandLineRunner {

    private static final String DEV_USER_NAME = "Nicholas Silva";
    private static final String DEV_USER_EMAIL = "nicholas.dev@freelacashflow.com";
    private static final String DEV_USER_PASSWORD = "123456";

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("Starting development data seed");

        UserDocument user = upsertDevUser();
        clearUserFinancialData(user.getId());

        Map<String, CategoryDocument> categoriesByName = createCategories(user.getId());
        createIncomes(user.getId());
        createExpenses(user.getId(), categoriesByName);

        log.info("Development data seed finished");
    }

    private UserDocument upsertDevUser() {
        LocalDateTime now = LocalDateTime.now();

        UserDocument user = userRepository.findByEmail(DEV_USER_EMAIL)
                .map(existingUser -> {
                    existingUser.setName(DEV_USER_NAME);
                    existingUser.setPassword(passwordEncoder.encode(DEV_USER_PASSWORD));
                    existingUser.setUpdatedAt(now);
                    return existingUser;
                })
                .orElseGet(() -> UserDocument.builder()
                        .name(DEV_USER_NAME)
                        .email(DEV_USER_EMAIL)
                        .password(passwordEncoder.encode(DEV_USER_PASSWORD))
                        .createdAt(now)
                        .updatedAt(now)
                        .build());

        UserDocument savedUser = userRepository.save(user);
        log.info("Development user ready: {}", savedUser.getEmail());
        return savedUser;
    }

    private void clearUserFinancialData(String userId) {
        expenseRepository.deleteAll(expenseRepository.findAllByUserId(userId));
        incomeRepository.deleteAll(incomeRepository.findAllByUserId(userId));
        categoryRepository.deleteAll(categoryRepository.findAllByUserId(userId));
    }

    private Map<String, CategoryDocument> createCategories(String userId) {
        LocalDateTime now = LocalDateTime.now();

        List<CategoryDocument> categories = List.of(
                category(userId, "Equipamentos", "Notebook, periféricos e equipamentos de trabalho", now),
                category(userId, "Internet", "Plano de internet usado para trabalho remoto", now),
                category(userId, "Alimentação", "Refeições durante dias de trabalho externo", now),
                category(userId, "Transporte", "Deslocamentos para coworking, clientes e reuniões", now),
                category(userId, "Educação", "Cursos, livros e treinamentos profissionais", now),
                category(userId, "Ferramentas", "Domínios, hospedagem e ferramentas técnicas", now),
                category(userId, "Assinaturas", "Softwares e serviços recorrentes", now),
                category(userId, "Moradia", "Custos de moradia que impactam o orçamento mensal", now),
                category(userId, "Saúde", "Consultas, medicamentos e cuidados pessoais", now),
                category(userId, "Outros", "Gastos pontuais sem categoria específica", now)
        );

        List<CategoryDocument> savedCategories = categoryRepository.saveAll(categories);
        log.info("Development categories created: {}", savedCategories.size());

        return savedCategories.stream()
                .collect(Collectors.toMap(CategoryDocument::getName, Function.identity()));
    }

    private CategoryDocument category(String userId, String name, String description, LocalDateTime now) {
        return CategoryDocument.builder()
                .userId(userId)
                .name(name)
                .description(description)
                .createdAt(now)
                .updatedAt(now)
                .build();
    }

    private void createIncomes(String userId) {
        LocalDate today = LocalDate.now();
        LocalDate currentMonth = today.withDayOfMonth(1);
        LocalDate previousMonth = currentMonth.minusMonths(1);
        LocalDateTime now = LocalDateTime.now();

        List<IncomeDocument> incomes = List.of(
                income(userId, "Parcela 1 do projeto landing page", "1500.00",
                        currentMonth.withDayOfMonth(5), currentMonth.withDayOfMonth(5),
                        IncomeStatus.RECEIVED, "Cliente Landing Page", now),
                income(userId, "Parcela 2 do projeto landing page", "1500.00",
                        currentMonth.withDayOfMonth(20), null,
                        IncomeStatus.EXPECTED, "Cliente Landing Page", now),
                income(userId, "Ajuste extra de manutenção", "350.00",
                        currentMonth.withDayOfMonth(12), currentMonth.withDayOfMonth(13),
                        IncomeStatus.RECEIVED, "Manutenção mensal", now),
                income(userId, "Projeto pequeno de correção de bugs", "600.00",
                        currentMonth.withDayOfMonth(28), null,
                        IncomeStatus.EXPECTED, "Cliente Correções", now),
                income(userId, "Projeto API freelance", "2200.00",
                        previousMonth.withDayOfMonth(10), previousMonth.withDayOfMonth(11),
                        IncomeStatus.RECEIVED, "Cliente API", now),
                income(userId, "Ajustes finais projeto API", "700.00",
                        previousMonth.withDayOfMonth(22), previousMonth.withDayOfMonth(22),
                        IncomeStatus.RECEIVED, "Cliente API", now)
        );

        List<IncomeDocument> savedIncomes = incomeRepository.saveAll(incomes);
        log.info("Development incomes created: {}", savedIncomes.size());
    }

    private IncomeDocument income(
            String userId,
            String description,
            String amount,
            LocalDate expectedDate,
            LocalDate receivedDate,
            IncomeStatus status,
            String source,
            LocalDateTime now
    ) {
        return IncomeDocument.builder()
                .userId(userId)
                .description(description)
                .amount(new BigDecimal(amount))
                .expectedDate(expectedDate)
                .receivedDate(receivedDate)
                .status(status)
                .source(source)
                .createdAt(now)
                .updatedAt(now)
                .build();
    }

    private void createExpenses(String userId, Map<String, CategoryDocument> categoriesByName) {
        LocalDate today = LocalDate.now();
        LocalDate currentMonth = today.withDayOfMonth(1);
        LocalDate previousMonth = currentMonth.minusMonths(1);
        LocalDateTime now = LocalDateTime.now();

        List<ExpenseDocument> expenses = List.of(
                expense(userId, categoriesByName, "Equipamentos", "Parcela do notebook", "1000.00",
                        currentMonth.withDayOfMonth(8), currentMonth.withDayOfMonth(8),
                        ExpenseStatus.PAID, true, now),
                expense(userId, categoriesByName, "Internet", "Internet", "120.00",
                        currentMonth.withDayOfMonth(18), null,
                        ExpenseStatus.PENDING, true, now),
                expense(userId, categoriesByName, "Assinaturas", "Assinatura ferramenta dev", "59.90",
                        currentMonth.withDayOfMonth(10), currentMonth.withDayOfMonth(10),
                        ExpenseStatus.PAID, true, now),
                expense(userId, categoriesByName, "Transporte", "Transporte para coworking", "80.00",
                        currentMonth.withDayOfMonth(14), currentMonth.withDayOfMonth(14),
                        ExpenseStatus.PAID, false, now),
                expense(userId, categoriesByName, "Educação", "Curso online", "149.90",
                        currentMonth.withDayOfMonth(25), null,
                        ExpenseStatus.PENDING, false, now),
                expense(userId, categoriesByName, "Ferramentas", "Despesa atrasada de domínio", "89.90",
                        currentMonth.withDayOfMonth(3), null,
                        ExpenseStatus.OVERDUE, false, now),
                expense(userId, categoriesByName, "Internet", "Internet", "120.00",
                        previousMonth.withDayOfMonth(18), previousMonth.withDayOfMonth(18),
                        ExpenseStatus.PAID, true, now),
                expense(userId, categoriesByName, "Equipamentos", "Parcela do notebook", "1000.00",
                        previousMonth.withDayOfMonth(8), previousMonth.withDayOfMonth(8),
                        ExpenseStatus.PAID, true, now),
                expense(userId, categoriesByName, "Alimentação", "Alimentação fora", "230.00",
                        previousMonth.withDayOfMonth(15), previousMonth.withDayOfMonth(15),
                        ExpenseStatus.PAID, false, now)
        );

        List<ExpenseDocument> savedExpenses = expenseRepository.saveAll(expenses);
        log.info("Development expenses created: {}", savedExpenses.size());
    }

    private ExpenseDocument expense(
            String userId,
            Map<String, CategoryDocument> categoriesByName,
            String categoryName,
            String description,
            String amount,
            LocalDate dueDate,
            LocalDate paidDate,
            ExpenseStatus status,
            boolean fixed,
            LocalDateTime now
    ) {
        CategoryDocument category = categoriesByName.get(categoryName);

        if (category == null) {
            throw new IllegalStateException("Development seed category not found: " + categoryName);
        }

        return ExpenseDocument.builder()
                .userId(userId)
                .categoryId(category.getCategoryId())
                .description(description)
                .amount(new BigDecimal(amount))
                .dueDate(dueDate)
                .paidDate(paidDate)
                .status(status)
                .fixed(fixed)
                .createdAt(now)
                .updatedAt(now)
                .build();
    }
}
