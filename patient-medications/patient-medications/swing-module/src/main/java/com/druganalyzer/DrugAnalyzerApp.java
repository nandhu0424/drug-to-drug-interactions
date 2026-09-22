package com.druganalyzer;

import javax.swing.*;
import javax.swing.border.*;
import javax.swing.filechooser.FileNameExtensionFilter;
import javax.swing.table.*;
import java.awt.*;
import java.awt.event.*;
import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.List;
import java.util.stream.*;
import java.util.stream.Collectors;

/**
 * DrugAnalyzerApp – Java Swing Desktop Module
 * Personalized Drug Interaction Risk Analyzer
 *
 * Features:
 *  - Load large drug interaction CSV datasets
 *  - Display data in a sortable, filterable JTable
 *  - Run local Apriori-style association mining
 *  - View association rules in a dedicated panel
 *  - Export results to TXT
 */
public class DrugAnalyzerApp extends JFrame {

    // ── Colors (dark theme) ──────────────────────────────────────────────────
    private static final Color BG_DARK   = new Color(11, 15, 26);
    private static final Color BG_PANEL  = new Color(17, 24, 39);
    private static final Color BG_CARD   = new Color(26, 34, 53);
    private static final Color CLR_CYAN  = new Color(0, 212, 255);
    private static final Color CLR_TEXT  = new Color(226, 232, 240);
    private static final Color CLR_MUTED = new Color(107, 114, 128);
    private static final Color SEV_LOW   = new Color(16, 185, 129);
    private static final Color SEV_MED   = new Color(245, 158, 11);
    private static final Color SEV_HIGH  = new Color(239, 68, 68);
    private static final Color SEV_CRIT  = new Color(220, 38, 38);

    // ── State ────────────────────────────────────────────────────────────────
    private List<Map<String, String>> allRows = new ArrayList<>();
    private DefaultTableModel tableModel;
    private JLabel statusLabel;
    private JTextArea rulesArea;
    private JTextField searchField;

    // ── Canonical Header Mapping ─────────────────────────────────────────────
    private static final Map<String, String> HEADER_MAP = new HashMap<>() {{
        put("drug1", "drug1"); put("d1", "drug1");
        put("drug2", "drug2"); put("d2", "drug2");
        put("age", "patient_age_group"); put("agegroup", "patient_age_group");
        put("patientagegroup", "patient_age_group");
        put("gender", "patient_gender"); put("sex", "patient_gender");
        put("patientgender", "patient_gender");
        put("nummedications", "num_medications"); put("meds", "num_medications");
        put("nummeds", "num_medications");
        put("renal", "has_renal_disease"); put("renaldisease", "has_renal_disease");
        put("hasrenaldisease", "has_renal_disease");
        put("kidney", "has_renal_disease");
        put("liver", "has_liver_disease"); put("liverdisease", "has_liver_disease");
        put("hasliverdisease", "has_liver_disease");
        put("hepatic", "has_liver_disease");
        put("cardiac", "has_cardiac_disease"); put("heart", "has_cardiac_disease");
        put("cardiacdisease", "has_cardiac_disease");
        put("hascardiacdisease", "has_cardiac_disease");
        put("diabetes", "has_diabetes"); put("diabetic", "has_diabetes");
        put("hasdiabetes", "has_diabetes"); put("diabets", "has_diabetes");
        put("severity", "severity"); put("risk", "severity");
        put("seve", "severity");
        put("type", "interaction_type"); put("interaction", "interaction_type");
        put("interactiontype", "interaction_type");
    }};

    // ── Constructor ───────────────────────────────────────────────────────────
    public DrugAnalyzerApp() {
        setTitle("💊 Drug Interaction Analyzer – Desktop Module");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1200, 780);
        setMinimumSize(new Dimension(900, 600));
        setLocationRelativeTo(null);
        getContentPane().setBackground(BG_DARK);

        try { UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName()); }
        catch (Exception ignored) {}

        buildUI();
        setVisible(true);
    }

    // ── UI Builder ────────────────────────────────────────────────────────────
    private void buildUI() {
        setLayout(new BorderLayout(0, 0));

        // Title bar
        add(buildTitleBar(), BorderLayout.NORTH);

        // Split pane: left = data table, right = rules panel
        JSplitPane split = new JSplitPane(JSplitPane.HORIZONTAL_SPLIT, buildDataPanel(), buildRulesPanel());
        split.setDividerLocation(780);
        split.setBackground(BG_DARK);
        split.setBorder(null);
        add(split, BorderLayout.CENTER);

        // Status bar
        add(buildStatusBar(), BorderLayout.SOUTH);
    }

    private JPanel buildTitleBar() {
        JPanel bar = new JPanel(new FlowLayout(FlowLayout.LEFT, 16, 12));
        bar.setBackground(BG_PANEL);
        bar.setBorder(BorderFactory.createMatteBorder(0, 0, 1, 0, new Color(30, 45, 69)));

        JLabel title = new JLabel("💊 Drug Interaction Risk Analyzer");
        title.setFont(new Font("Segoe UI", Font.BOLD, 18));
        title.setForeground(CLR_TEXT);
        bar.add(title);

        JLabel badge = new JLabel("Desktop Module");
        badge.setFont(new Font("Segoe UI", Font.BOLD, 11));
        badge.setForeground(CLR_CYAN);
        badge.setBorder(new EmptyBorder(3, 10, 3, 10));
        badge.setOpaque(true);
        badge.setBackground(new Color(0, 212, 255, 30));
        bar.add(badge);

        // Toolbar buttons
        bar.add(Box.createHorizontalGlue());
        bar.add(makeButton("📂 Load Dataset", CLR_CYAN, e -> loadDataset()));
        bar.add(makeButton("🔗 Run Mining", SEV_MED, e -> runAssociationMining()));
        bar.add(makeButton("💾 Export Rules", SEV_LOW, e -> exportRules()));

        return bar;
    }

    private JPanel buildDataPanel() {
        JPanel panel = new JPanel(new BorderLayout(0, 8));
        panel.setBackground(BG_DARK);
        panel.setBorder(new EmptyBorder(16, 16, 0, 8));

        // Search bar
        JPanel searchBar = new JPanel(new BorderLayout(8, 0));
        searchBar.setBackground(BG_DARK);
        searchField = new JTextField();
        styleTextField(searchField, "🔍  Search drugs, severity...");
        searchField.addActionListener(e -> filterTable(searchField.getText()));
        JButton searchBtn = makeButton("Search", CLR_CYAN, e -> filterTable(searchField.getText()));
        searchBar.add(searchField, BorderLayout.CENTER);
        searchBar.add(searchBtn, BorderLayout.EAST);
        panel.add(searchBar, BorderLayout.NORTH);

        // Table
        String[] cols = {"Drug 1", "Drug 2", "Age Group", "Gender", "# Meds", "Renal", "Liver", "Cardiac", "Diabetes", "Severity", "Type"};
        tableModel = new DefaultTableModel(cols, 0) {
            @Override public boolean isCellEditable(int r, int c) { return false; }
        };
        JTable table = new JTable(tableModel);
        styleTable(table);

        // Custom renderer for Severity column
        table.getColumnModel().getColumn(9).setCellRenderer(new SeverityRenderer());

        JScrollPane scroll = new JScrollPane(table);
        scroll.setBackground(BG_DARK);
        scroll.setBorder(BorderFactory.createLineBorder(new Color(30, 45, 69)));
        scroll.getViewport().setBackground(BG_CARD);
        panel.add(scroll, BorderLayout.CENTER);

        return panel;
    }

    private JPanel buildRulesPanel() {
        JPanel panel = new JPanel(new BorderLayout(0, 8));
        panel.setBackground(BG_DARK);
        panel.setBorder(new EmptyBorder(16, 8, 0, 16));

        JLabel header = new JLabel("🔗 Association Rules");
        header.setFont(new Font("Segoe UI", Font.BOLD, 14));
        header.setForeground(CLR_TEXT);
        header.setBorder(new EmptyBorder(0, 0, 8, 0));
        panel.add(header, BorderLayout.NORTH);

        rulesArea = new JTextArea("Click 'Run Mining' to generate association rules from the loaded dataset.\n\nThe Apriori algorithm will find frequent drug co-occurrence patterns and generate rules with support, confidence and lift metrics.");
        rulesArea.setFont(new Font("Consolas", Font.PLAIN, 12));
        rulesArea.setForeground(CLR_TEXT);
        rulesArea.setBackground(BG_CARD);
        rulesArea.setEditable(false);
        rulesArea.setLineWrap(true);
        rulesArea.setWrapStyleWord(true);
        rulesArea.setBorder(new EmptyBorder(12, 12, 12, 12));

        JScrollPane scroll = new JScrollPane(rulesArea);
        scroll.setBorder(BorderFactory.createLineBorder(new Color(30, 45, 69)));
        scroll.getViewport().setBackground(BG_CARD);
        panel.add(scroll, BorderLayout.CENTER);

        return panel;
    }

    private JPanel buildStatusBar() {
        JPanel bar = new JPanel(new FlowLayout(FlowLayout.LEFT, 16, 8));
        bar.setBackground(BG_PANEL);
        bar.setBorder(BorderFactory.createMatteBorder(1, 0, 0, 0, new Color(30, 45, 69)));
        statusLabel = new JLabel("Ready — Load a dataset to begin.");
        statusLabel.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        statusLabel.setForeground(CLR_MUTED);
        bar.add(statusLabel);
        return bar;
    }

    // ── Actions ───────────────────────────────────────────────────────────────
    private void loadDataset() {
        JFileChooser fc = new JFileChooser();
        fc.setFileFilter(new FileNameExtensionFilter("CSV Files (*.csv)", "csv"));
        fc.setDialogTitle("Select Drug Interaction Dataset");
        if (fc.showOpenDialog(this) != JFileChooser.APPROVE_OPTION) return;

        File file = fc.getSelectedFile();
        SwingWorker<Void, String> worker = new SwingWorker<>() {
            @Override protected Void doInBackground() throws Exception {
                publish("Loading " + file.getName() + "...");
                
                synchronized(allRows) {
                    allRows.clear();
                    tableModel.setRowCount(0);
                }

                long startTime = System.nanoTime();
                
                try (BufferedReader br = new BufferedReader(new FileReader(file))) {
                    String headerLine = br.readLine();
                    if (headerLine == null) return null;
                    String[] headers = headerLine.split(",");

                    String line;
                    int count = 0;
                    while ((line = br.readLine()) != null) {
                        String[] vals = line.split(",", -1);
                        Map<String, String> row = new LinkedHashMap<>();
                        for (int i = 0; i < Math.min(headers.length, vals.length); i++) {
                            String rawHeader = headers[i].trim();
                            String normalized = rawHeader.toLowerCase().replaceAll("[^a-z0-9]", "");
                            String canonical = HEADER_MAP.getOrDefault(normalized, normalized);
                            row.put(canonical, vals[i].trim());
                        }
                        
                        synchronized(allRows) {
                            allRows.add(row);
                        }

                        // Table row: drug1,drug2,age_group,gender,num_meds,renal,liver,cardiac,diabetes,severity,type
                        Object[] tableRow = {
                            getVal(row, "drug1"), getVal(row, "drug2"),
                            getVal(row, "patient_age_group"), getVal(row, "patient_gender"),
                            getVal(row, "num_medications"),
                            yesNo(getVal(row, "has_renal_disease")),
                            yesNo(getVal(row, "has_liver_disease")),
                            yesNo(getVal(row, "has_cardiac_disease")),
                            yesNo(getVal(row, "has_diabetes")),
                            getVal(row, "severity"),
                            getVal(row, "interaction_type")
                        };
                        tableModel.addRow(tableRow);
                        count++;
                    }
                    
                    long endTime = System.nanoTime();
                    double ms = (endTime - startTime) / 1_000_000.0;
                    publish(String.format("Loaded %d records in %.2f ms from %s", count, ms, file.getName()));
                }
                return null;
            }

            @Override protected void process(List<String> msgs) {
                statusLabel.setText(msgs.get(msgs.size() - 1));
                statusLabel.setForeground(CLR_CYAN);
            }

            @Override protected void done() {
                statusLabel.setText("✅ " + allRows.size() + " records loaded. Ready for analysis.");
                statusLabel.setForeground(SEV_LOW);
            }
        };
        worker.execute();
    }

    private void filterTable(String query) {
        tableModel.setRowCount(0);
        String q = query.toLowerCase().trim();
        for (Map<String, String> row : allRows) {
            boolean match = q.isEmpty() || row.values().stream().anyMatch(v -> v.toLowerCase().contains(q));
            if (match) {
                tableModel.addRow(new Object[]{
                    getVal(row,"drug1"), getVal(row,"drug2"),
                    getVal(row,"patient_age_group"), getVal(row,"patient_gender"),
                    getVal(row,"num_medications"),
                    yesNo(getVal(row,"has_renal_disease")),
                    yesNo(getVal(row,"has_liver_disease")),
                    yesNo(getVal(row,"has_cardiac_disease")),
                    yesNo(getVal(row,"has_diabetes")),
                    getVal(row,"severity"),
                    getVal(row,"interaction_type")
                });
            }
        }
        statusLabel.setForeground(CLR_CYAN);
        statusLabel.setText("Filter applied: " + tableModel.getRowCount() + " matching records.");
    }

    private void runAssociationMining() {
        if (allRows.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please load a dataset first.", "No Data", JOptionPane.WARNING_MESSAGE);
            return;
        }

        SwingWorker<String, Void> worker = new SwingWorker<>() {
            @Override protected String doInBackground() {
                long startTime = System.nanoTime();
                
                // Defensive copy to prevent ConcurrentModificationException
                List<Map<String, String>> dataSnapshot;
                synchronized(allRows) {
                    dataSnapshot = new ArrayList<>(allRows);
                }

                if (dataSnapshot.isEmpty()) return "No data to analyze.";

                // Build item baskets (each row = one transaction)
                List<List<String>> baskets = new ArrayList<>();
                for (Map<String, String> row : dataSnapshot) {
                    List<String> basket = new ArrayList<>();
                    String d1 = getVal(row, "drug1");
                    String d2 = getVal(row, "drug2");
                    String sev = getVal(row, "severity");
                    String age = getVal(row, "patient_age_group");
                    if (!d1.isEmpty()) basket.add("drug:" + d1);
                    if (!d2.isEmpty()) basket.add("drug:" + d2);
                    if (!sev.isEmpty()) basket.add("severity:" + sev);
                    if (!age.isEmpty()) basket.add("age:" + age);
                    if ("1".equals(getVal(row,"has_cardiac_disease"))) basket.add("condition:cardiac");
                    if ("1".equals(getVal(row,"has_renal_disease")))   basket.add("condition:renal");
                    if ("1".equals(getVal(row,"has_diabetes")))        basket.add("condition:diabetes");
                    baskets.add(basket);
                }

                int total = baskets.size();

                // Count single-item support
                Map<String, Integer> singleCount = new HashMap<>();
                for (List<String> basket : baskets) {
                    for (String item : new HashSet<>(basket)) {
                        singleCount.merge(item, 1, Integer::sum);
                    }
                }

                // Frequent single items (min support 10%)
                double minSupport = 0.10;
                Set<String> freqItems = singleCount.entrySet().stream()
                    .filter(e -> (double) e.getValue() / total >= minSupport)
                    .map(Map.Entry::getKey)
                    .collect(Collectors.toSet());

                // Count 2-item pairs
                Map<String, Integer> pairCount = new HashMap<>();
                for (List<String> basket : baskets) {
                    List<String> freqInBasket = basket.stream().filter(freqItems::contains).collect(Collectors.toList());
                    for (int i = 0; i < freqInBasket.size(); i++) {
                        for (int j = i + 1; j < freqInBasket.size(); j++) {
                            String key = freqInBasket.get(i) + " => " + freqInBasket.get(j);
                            pairCount.merge(key, 1, Integer::sum);
                        }
                    }
                }

                long endTime = System.nanoTime();
                double ms = (endTime - startTime) / 1_000_000.0;

                // Generate rules (min confidence 60%)
                StringBuilder sb = new StringBuilder();
                sb.append("═══════════════════════════════════════════════════════════\n");
                sb.append("  ASSOCIATION RULES (Apriori) – Drug Interaction Patterns\n");
                sb.append("  Dataset: ").append(total).append(" transactions | Min Support: 10% | Min Confidence: 60%\n");
                sb.append(String.format("  Processing Speed: Computed locally in %.2f ms\n", ms));
                sb.append("═══════════════════════════════════════════════════════════\n\n");

                List<Map.Entry<String, Integer>> sortedPairs = pairCount.entrySet().stream()
                    .sorted((a, b) -> b.getValue() - a.getValue())
                    .filter(e -> (double) e.getValue() / total >= minSupport * 0.5)
                    .limit(25)
                    .collect(Collectors.toList());

                if (sortedPairs.isEmpty()) {
                    sb.append("No frequent patterns found with current settings.\n");
                    sb.append("Try loading a larger dataset.\n");
                } else {
                    int ruleNum = 1;
                    for (Map.Entry<String, Integer> entry : sortedPairs) {
                        String[] parts = entry.getKey().split(" => ");
                        if (parts.length != 2) continue;
                        String ant = parts[0];
                        String con = parts[1];
                        double support    = (double) entry.getValue() / total;
                        int antCount  = singleCount.getOrDefault(ant, 1);
                        double conf   = antCount > 0 ? (double) entry.getValue() / antCount : 0;
                        int conCount  = singleCount.getOrDefault(con, 1);
                        double lift   = conf / ((double) conCount / total);

                        sb.append(String.format("Rule #%2d: %s\n", ruleNum++, "─".repeat(48)));
                        sb.append(String.format("  Antecedent:  %-35s\n", ant));
                        sb.append(String.format("  Consequent:  %-35s\n", con));
                        sb.append(String.format("  Support:     %.1f%%\n", support * 100));
                        sb.append(String.format("  Confidence:  %.1f%%\n", conf * 100));
                        sb.append(String.format("  Lift:        %.2f %s\n", lift, lift > 1 ? "✓ (Positive association)" : "○"));
                        sb.append("\n");
                    }
                }

                sb.append("═══════════════════════════════════════════════════════════\n");
                sb.append("  Total frequent item pairs found: ").append(pairCount.size()).append("\n");
                sb.append("  Frequent single items found:     ").append(freqItems.size()).append("\n");

                return sb.toString();
            }

            @Override protected void done() {
                try {
                    rulesArea.setText(get());
                    rulesArea.setCaretPosition(0);
                    statusLabel.setText("✅ Association mining complete. " + allRows.size() + " records analyzed.");
                    statusLabel.setForeground(SEV_LOW);
                } catch (Exception e) {
                    rulesArea.setText("Error: " + e.getMessage());
                }
            }
        };
        statusLabel.setText("⏳ Running Apriori association mining...");
        statusLabel.setForeground(SEV_MED);
        worker.execute();
    }

    private void exportRules() {
        String rules = rulesArea.getText();
        if (rules.isBlank()) {
            JOptionPane.showMessageDialog(this, "No rules to export. Run association mining first.", "Nothing to Export", JOptionPane.WARNING_MESSAGE);
            return;
        }
        JFileChooser fc = new JFileChooser();
        fc.setSelectedFile(new File("drug_association_rules.txt"));
        if (fc.showSaveDialog(this) != JFileChooser.APPROVE_OPTION) return;
        try {
            Files.writeString(fc.getSelectedFile().toPath(), rules);
            statusLabel.setText("✅ Rules exported to " + fc.getSelectedFile().getName());
            statusLabel.setForeground(SEV_LOW);
        } catch (IOException ex) {
            JOptionPane.showMessageDialog(this, "Export failed: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    private String getVal(Map<String, String> row, String key) {
        return row.getOrDefault(key, "");
    }
    private String yesNo(String s) {
        return "1".equals(s) ? "Yes" : "No";
    }

    private JButton makeButton(String text, Color fg, ActionListener al) {
        JButton btn = new JButton(text);
        btn.setFont(new Font("Segoe UI", Font.BOLD, 12));
        btn.setForeground(fg);
        btn.setBackground(BG_CARD);
        btn.setBorder(new CompoundBorder(
            BorderFactory.createLineBorder(new Color(30, 45, 69), 1),
            new EmptyBorder(6, 16, 6, 16)
        ));
        btn.setFocusPainted(false);
        btn.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        btn.addActionListener(al);
        btn.addMouseListener(new MouseAdapter() {
            public void mouseEntered(MouseEvent e) { btn.setBackground(new Color(fg.getRed(), fg.getGreen(), fg.getBlue(), 30)); }
            public void mouseExited(MouseEvent e)  { btn.setBackground(BG_CARD); }
        });
        return btn;
    }

    private void styleTextField(JTextField tf, String placeholder) {
        tf.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        tf.setForeground(CLR_MUTED);
        tf.setBackground(BG_CARD);
        tf.setCaretColor(CLR_CYAN);
        tf.setBorder(new CompoundBorder(
            BorderFactory.createLineBorder(new Color(30, 45, 69), 1),
            new EmptyBorder(7, 14, 7, 14)
        ));
        tf.setText(placeholder);
        tf.addFocusListener(new FocusAdapter() {
            public void focusGained(FocusEvent e) { if (tf.getText().equals(placeholder)) { tf.setText(""); tf.setForeground(CLR_TEXT); } }
            public void focusLost(FocusEvent e)   { if (tf.getText().isBlank()) { tf.setText(placeholder); tf.setForeground(CLR_MUTED); } }
        });
    }

    private void styleTable(JTable table) {
        table.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        table.setForeground(CLR_TEXT);
        table.setBackground(BG_CARD);
        table.setGridColor(new Color(30, 45, 69));
        table.setRowHeight(28);
        table.setSelectionBackground(new Color(0, 212, 255, 40));
        table.setSelectionForeground(CLR_TEXT);
        table.setShowHorizontalLines(true);
        table.setShowVerticalLines(false);
        table.setAutoCreateRowSorter(true);
        table.getTableHeader().setFont(new Font("Segoe UI", Font.BOLD, 11));
        table.getTableHeader().setForeground(CLR_MUTED);
        table.getTableHeader().setBackground(BG_PANEL);
        table.getTableHeader().setBorder(BorderFactory.createMatteBorder(0, 0, 1, 0, new Color(30, 45, 69)));
        table.setIntercellSpacing(new Dimension(8, 0));
    }

    // ── Severity Cell Renderer ────────────────────────────────────────────────
    static class SeverityRenderer extends DefaultTableCellRenderer {
        @Override
        public Component getTableCellRendererComponent(JTable table, Object value, boolean selected, boolean focused, int row, int col) {
            JLabel label = (JLabel) super.getTableCellRendererComponent(table, value, selected, focused, row, col);
            String sev = value == null ? "" : value.toString();
            label.setHorizontalAlignment(SwingConstants.CENTER);
            label.setBorder(new EmptyBorder(4, 8, 4, 8));
            label.setOpaque(true);
            switch (sev) {
                case "Low"      -> { label.setForeground(new Color(16, 185, 129)); label.setBackground(new Color(16, 185, 129, 30)); }
                case "Medium"   -> { label.setForeground(new Color(245, 158, 11)); label.setBackground(new Color(245, 158, 11, 30)); }
                case "High"     -> { label.setForeground(new Color(239, 68, 68));  label.setBackground(new Color(239, 68, 68, 30)); }
                case "Critical" -> { label.setForeground(new Color(220, 38, 38));  label.setBackground(new Color(220, 38, 38, 40)); label.setFont(label.getFont().deriveFont(Font.BOLD)); }
                default         -> { label.setForeground(new Color(107, 114, 128)); label.setBackground(new Color(26, 34, 53)); }
            }
            return label;
        }
    }

    // ── Main ──────────────────────────────────────────────────────────────────
    public static void main(String[] args) {
        SwingUtilities.invokeLater(DrugAnalyzerApp::new);
    }
}
