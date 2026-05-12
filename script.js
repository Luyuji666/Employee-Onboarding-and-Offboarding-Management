document.addEventListener('DOMContentLoaded', function() {
    // =============== 选项卡切换 ===============
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 更新选项卡状态
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 显示对应内容
            const tabId = btn.getAttribute('data-tab');
            tabContents.forEach(content => {
                content.style.display = content.id === tabId ? 'block' : 'none';
            });
        });
    });

    // =============== 社保基数显示控制 ===============
    const ssSelect = document.getElementById('social-security');
    const ssBaseGroup = document.getElementById('ss-base-group');
    
    ssSelect.addEventListener('change', () => {
        ssBaseGroup.style.display = ssSelect.value === 'yes' ? 'block' : 'none';
    });

    // =============== 二维码生成 ===============
    const generateQRBtn = document.getElementById('generate-qr');
    const qrModal = document.getElementById('qr-modal');
    const closeModal = document.querySelector('.close');
    
    generateQRBtn.addEventListener('click', () => {
        const employeeName = document.getElementById('employee-name').value;
        if (!employeeName) {
            alert('请先填写员工姓名！');
            return;
        }
        
        // 生成唯一提交链接（实际使用中应替换为真实URL）
        const submitLink = `https://hr-sop.example.com/submit?name=${encodeURIComponent(employeeName)}&id=${Date.now()}`;
        
        // 清除旧二维码
        document.getElementById('qrcode').innerHTML = '';
        
        // 生成新二维码
        new QRCode(document.getElementById('qrcode'), {
            text: submitLink,
            width: 200,
            height: 200
        });
        
        qrModal.style.display = 'flex';
    });
    
    closeModal.addEventListener('click', () => {
        qrModal.style.display = 'none';
    });
    
    document.getElementById('copy-qr-link').addEventListener('click', () => {
        const employeeName = document.getElementById('employee-name').value;
        const submitLink = `https://hr-sop.example.com/submit?name=${encodeURIComponent(employeeName)}&id=${Date.now()}`;
        
        navigator.clipboard.writeText(submitLink).then(() => {
            alert('提交链接已复制到剪贴板！');
        });
    });

    // =============== 材料状态监控 ===============
    const materialCheckboxes = document.querySelectorAll('.check-item input[type="checkbox"]');
    const materialStatus = document.getElementById('material-status');
    const ssCard = document.getElementById('ss-card');
    const ssWarning = document.getElementById('ss-warning');
    
    // 常见问题检测
    function checkMaterialIssues() {
        // 身份证问题检测
        if (document.getElementById('id-card').checked) {
            document.getElementById('id-card-error').textContent = '';
        } else {
            document.getElementById('id-card-error').textContent = '未提交';
            document.getElementById('id-card-error').style.color = 'var(--error)';
        }
        
        // 离职证明检测
        if (!document.getElementById('resign').checked) {
            document.getElementById('resign-error').textContent = '必须提供';
            document.getElementById('resign-error').style.color = 'var(--error)';
        }
        
        // 体检报告检测
        if (document.getElementById('medical').checked) {
            document.getElementById('medical-error').textContent = '';
        } else {
            document.getElementById('medical-error').textContent = '缺关键项目';
            document.getElementById('medical-error').style.color = 'var(--error)';
        }
    }

    materialCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            // 检查问题
            checkMaterialIssues();
            
            // 更新状态
            const checkedCount = document.querySelectorAll('.check-item input[type="checkbox"]:checked').length;
            const totalCount = materialCheckboxes.length;
            
            if (checkedCount === 0) {
                materialStatus.textContent = '待提交';
                materialStatus.style.backgroundColor = '#fff7e6';
                materialStatus.style.color = '#fa8c16';
            } else if (checkedCount < totalCount) {
                materialStatus.textContent = `进行中 (${checkedCount}/${totalCount})`;
                materialStatus.style.backgroundColor = '#e6f7ff';
                materialStatus.style.color = '#1890ff';
            } else {
                materialStatus.textContent = '已完成';
                materialStatus.style.backgroundColor = '#f6ffed';
                materialStatus.style.color = '#52c41a';
                
                // 材料齐全后显示社保卡片
                ssCard.style.display = 'block';
            }
        });
    });

    // =============== 社保问题检查 ===============
    document.getElementById('ss-complete').addEventListener('click', () => {
        const issues = [
            document.getElementById('ss-issue1').checked,
            document.getElementById('ss-issue2').checked,
            document.getElementById('ss-issue3').checked
        ];
        
        if (issues.includes(false)) {
            ssWarning.style.display = 'block';
        } else {
            ssWarning.style.display = 'none';
            alert('社保增员流程已确认完成！');
            // 实际业务中可添加数据保存逻辑
        }
    });

    // =============== 离职申请审核 ===============
    document.getElementById('approve-offboarding').addEventListener('click', () => {
        const checks = [
            document.getElementById('check-contract-date').checked,
            document.getElementById('check-employer').checked,
            document.getElementById('check-reason').checked,
            document.getElementById('check-signature').checked
        ];
        
        if (checks.includes(false)) {
            alert('请完成所有审核项后再提交！');
        } else {
            alert('离职申请已通过审核！系统将自动通知员工办理离职证明');
        }
    });

    // =============== 知识库交互 ===============
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const issue = btn.getAttribute('data-issue');
            document.querySelectorAll('.solution-panel').forEach(panel => {
                panel.style.display = 'none';
            });
            document.getElementById(`solution-${issue}`).style.display = 'block';
        });
    });

    document.getElementById('download-ss-notice').addEventListener('click', (e) => {
        e.preventDefault();
        alert('【实际部署时】将下载《社保异常情况说明》模板文件\n（当前演示版仅展示功能）');
    });

    // =============== 数据清除 ===============
    document.getElementById('clear-data').addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('确定要清除所有本地存储的数据吗？此操作不可恢复！')) {
            localStorage.clear();
            alert('数据已清除，页面将刷新');
            location.reload();
        }
    });

    // =============== 初始化 ===============
    checkMaterialIssues();
});
